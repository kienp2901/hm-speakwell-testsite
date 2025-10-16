import { CSSProperties, FC } from 'react';

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
  [key: string]: any;
  variant?: 'solid' | 'outline';
};
const Button: FC<ButtonProps> = props => {
  const { className, children, disabled, type = 'button', variant } = props;

  const styles = {
    btn: `px-4 sm:px-5 py-2 sm:py-[10px] rounded-full tracking-[1px] text-sm transition-all flex flex-shrink-0 items-center justify-center
    ${className} 
    ${
      variant === 'outline'
        ? 'border border-ct-primary-400 text-ct-primary-400 py-2 sm:py-[9px]'
        : 'bg-ct-primary-400 text-white'
    }  ${disabled ? 'opacity-50' : ''}
    `,
  };
  return (
    <button {...props} className={styles.btn} type={type}>
      {children}
    </button>
  );
};

export default Button;
