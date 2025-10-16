/* eslint-disable object-shorthand */
import { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-anhnk';
interface EditorProps {
  handleContent: (content: string) => void;
  label?: string;
  placeholder?: string;
  contentQuestion?: string;
  error?: boolean;
  required?: boolean;
  showOnly?: boolean;
  className?: string;
  disableItem?: string[];
}
import { notify } from '@/utils/notify';
import { apiUploadFile } from '@/service/api/fileApi';

import 'ckeditor5-classic-with-mathtype/build/translations/vi.js';

import './style.css';

const CK5Editor = ({
  handleContent,
  label,
  placeholder,
  contentQuestion,
  error,
  required,
  showOnly,
  className,
  disableItem,
}: EditorProps) => {
  const [content, setContent] = useState(contentQuestion);
  const itemsToolbar = [
    'MathType',
    'ChemType',
    'heading',
    '|',
    'bold',
    'underline',
    'italic',
    'link',
    'subscript',
    'superscript',
    'fontColor',
    'fontFamily',
    'fontSize',
    'bulletedList',
    'numberedList',
    '|',
    'outdent',
    'indent',
    'alignment',
    '|',
    'imageUpload',
    'blockQuote',
    'insertTable',
    'mediaEmbed',
    'undo',
    'redo',
    'removeFormat',
  ];
  const items = itemsToolbar.filter(item => {
    if (disableItem) {
      return !disableItem.includes(item);
    }
    return true;
  });

  useEffect(() => {
    contentQuestion && setContent(contentQuestion);
  }, [contentQuestion]);

  return (
    <div className={`text-black font-[Gilroy] ${className}`}>
      <style>
        {error
          ? `
                    .ckstyle-err .ck-editor__editable {
                        border: 1px solid red !important;
                    }
                    .ckstyle-err .ck-toolbar {
                        border: 1px solid red !important;
                    }
                `
          : ''}
      </style>
      <style>
        {showOnly
          ? `
                        .ckstyle .ck-editor__editable {
                            min-height: min-content !important;
                            border-radius: 16px !important;
                        }
                        .ckstyle .ck-toolbar {
                            display: none !important;
                        }
                    `
          : ''}
      </style>
      <span className="font-bold my-2">{label}</span>
      {required ? <span className="text-ct-red-500 "> *</span> : ''}
      <div
        className={`${error ? 'ckstyle-err' : ''} ${showOnly ? 'ckstyle' : ''}`}
      >
        <CKEditor
          editor={ClassicEditor}
          config={{
            toolbar: {
              items: items,
            },
            placeholder: placeholder,
            extraPlugins: [MyCustomUploadAdapterPlugin],
          }}
          data={content}
          onReady={(editor: any) => {
            editor.ui.editor.isReadOnly = showOnly;
            editor.plugins.get('FileRepository').createUploadAdapter = (
              loader: any,
            ) => {
              return MyUploadAdapter(loader);
            };
          }}
          onChange={(event: any, editor: any) => {
            const data = editor.getData();
            setContent(data);
            handleContent(data);
          }}
        />
      </div>
      <p className={`${error ? 'text-ct-red-500 text-sm' : 'hidden'}`}>
        Câu hỏi không được để trống
      </p>
    </div>
  );
};
function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return MyUploadAdapter(loader);
  };
}

function MyUploadAdapter(loader: any) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        loader.file.then((img: any) => {
          formData.append('image', img, img.name);
          apiUploadFile({ formData })
            .then((res: any) => {
              if (res.status) {
                notify({ type: 'success', message: 'Tải ảnh thành công' });
                resolve({
                  default: res.data.images[0].uri,
                });
              }
            })
            .catch(err => {
              console.log(err);
              notify({ type: 'error', message: 'Tải ảnh thất bại' });
              reject(err);
            });
        });
      });
    },
  };
}
export default CK5Editor;
