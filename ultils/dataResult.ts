interface ResultData {
  comment: string[] | string;
  improve: string;
  course?: string;
}

export const dataListening = (score: number): ResultData => {
  if (score <= 4) {
    return {
      comment: [
        'Học viên chưa tập trung vào bài nghe',
        'Học viên chưa nghe hiểu được các từ đơn, câu ngắn, đơn giản',
        'Học viên chưa bắt kịp nhịp độ nói trong đoạn hội thoại/ bài nói để suy luận được nội dung',
      ],
      improve:
        'Học viên cần cải thiện kỹ năng nghe bằng cách nghe thường xuyên hơn. Lộ trình đề xuất là học viên nghe hàng ngày, mỗi lần nghe khoảng 10 phút, bắt đầu từ các từ đơn, câu đơn, đoạn hội thoại ngắn để có thể bắt kịp tốc độ của người nói',
    };
  } else if (score > 4 && score <= 7) {
    return {
      comment: [
        'Kỹ năng nghe của học viên ở mức cơ bản',
        'Học viên đã nghe hiểu được một số từ đơn, câu ngắn, đơn giản trong đoạn hội thoại nhưng vẫn chưa nghe hiểu được toàn bộ nội dung',
        'Học viên hầu như bắt kịp nhịp độ nói trong đoạn hội thoại để hiểu một phần nội dung chính, các từ khóa trong câu để suy luận được một số câu trả lời',
      ],
      improve:
        'Kỹ năng nghe của học viên có thể được nâng lên bằng cách nghe thường xuyên hơn. Lộ trình đề xuất là học viên nghe 5 lần trong tuần, mỗi lần nghe khoảng 10-15 phút. Ngoài việc nghe các hội thoại, học viên cần nghe thêm bài nghe trình bày ngắn về một chủ đề. Điều này sẽ giúp học viên tập trung hơn khi nghe.',
    };
  } else {
    return {
      comment: [
        'Kỹ năng nghe của học viên khá tốt',
        'Học viên tập trung khi nghe, và có thể nghe hiểu các câu và đoạn hội thoại đơn giản.',
        'Học viên bắt kịp nhịp độ nói trong đoạn hội thoại và có khả năng suy luận các câu trả lời của bài.',
      ],
      improve:
        'Kỹ năng nghe của học viên có thể được nâng cao bằng cách nghe thường xuyên hơn. Lộ trình đề xuất là học viên nghe 5 lần trong tuần, mỗi lần nghe khoảng 10-15 phút. Ngoài việc nghe các hội thoại, học viên cần nghe thêm bài nghe trình bày ngắn hoặc bài diễn thuyết ngắn về một chủ đề. Điều này sẽ giúp học viên tăng sự tập trung và khả năng suy luận trong khi nghe.',
    };
  }
};

export const dataRedingWriting = (score: number): ResultData => {
  if (score <= 3) {
    return {
      comment: [
        'Học viên đã nhận biết được các từ đơn, nhận diện được từ dựa trên hình ảnh và chữ cái',
        'Học viên chưa đọc và hiểu được các câu ở dạng viết.',
      ],
      improve:
        'Học viên cần cải thiện kỹ năng đọc và viết thông qua việc nâng cao vốn từ vựng và cấu trúc câu. Một lộ trình gồm các bài học về từ vựng, ngữ pháp cơ bản và các đoạn hội thoại ngắn sẽ giúp học viên nâng cao trình độ đọc hiểu. Từ đó, học viên có thể vận dụng kiến thức để có thể viết được các từ, câu đơn giản.',
    };
  } else if (score >= 4 && score <= 7) {
    return {
      comment: [
        'Học viên đã đọc hiểu được các từ đơn giản và 1 số các câu đơn ngắn có cấu trúc quen thuộc.',
        'Vốn ngữ pháp của học viên còn yếu nên chưa thể xây dựng câu.',
        'Vốn từ vựng của học viên còn yếu nên chưa đọc được đoạn văn ngắn.',
      ],
      improve:
        'Kỹ năng đọc và viết của học viên sẽ được cải thiện đáng kể khi học viên chú trọng vào nâng cao từ vựng và cấu trúc ngữ pháp. Học viên cần có một lộ trình học từ vựng và ngữ pháp phù hợp với trình độ và độ tuổi để phát triển kỹ năng đọc, viết và tư duy suy luận trong quá trình đọc hiểu văn bản. Học sinh có thể bắt đầu từ những đoạn hội thoại, đoạn văn ngắn có hình ảnh minh họa và viết các câu đơn.',
    };
  } else if (score >= 8 && score <= 13) {
    return {
      comment: [
        'Học viên có lượng vốn từ nhất định để hiểu các đoạn hội thoại ngắn, quen thuộc hàng ngày.',
        'Học viên có thể suy luận hình ảnh thành câu chữ.',
        'Vốn ngữ pháp của học viên còn hạn chế nên chưa xây dựng được câu hoàn chỉnh, vẫn còn lỗi ngữ pháp.',
        'Vốn từ vựng của học viên còn hạn chế nên chưa hiểu được hết toàn bộ nội dung văn bản.',
      ],
      improve:
        'Học viên cần nâng cao vốn từ vựng và cấu trúc ngữ pháp để có thể nâng cao khả năng đọc viết Tiếng Anh của bản thân. Kỹ năng đọc của học viên sẽ được cải thiện đáng kể khi học viên kết hợp giữa việc đọc và việc đào sâu vốn từ vựng cũng như khả năng đoán từ trong văn bản. Điều này sẽ giúp học viên tăng khả năng đọc hiểu các bài đọc dài hơn. Kỹ năng viết sẽ đi kèm với quá trình nâng cao ngữ pháp chuyên sâu. Học viên cũng cần luyện tập viết câu thường xuyên, tăng số lượng từ trong câu và vận dụng nhiều cấu trúc ngữ pháp chuyên sâu hơn khi viết.',
    };
  } else if (score >= 14 && score <= 17) {
    return {
      comment: [
        'Kỹ năng đọc hiểu của học viên khá tốt. Học viên có thể hiểu cơ bản các bài đọc với hình ảnh minh họa.',
        'Học viên có khả năng suy luận, chọn lọc thông tin để tóm tắt nội dung và truyền đạt lại theo cách trình bày khác nhau.',
        'Vốn từ vựng, ngữ pháp của học viên đủ để viết các câu đơn giản hoàn chỉnh.',
        'Học viên chưa xây dựng được câu và đoạn văn có cấu trúc phức tạp và từ vựng nâng cao.',
      ],
      improve:
        'Kỹ năng đọc của học viên sẽ có thể được tiếp tục cải thiện khi học sinh luyện tập làm các bài đọc hiểu có độ khó cao hơn về mặt từ vựng và ngữ pháp, cũng như yêu cầu bài đọc mang tính chất phức tạp hơn. Kỹ năng viết của học viên sẽ còn được cải thiện khi học viên chú trọng vào việc kết hợp giữa các từ vựng nâng cao và cấu trúc ngữ pháp chuyên sâu. Học viên cũng cần luyện tập viết các đoạn văn ngắn (dưới 50 từ) để tăng khả năng viết Tiếng Anh.',
    };
  } else {
    return {
      comment: [
        'Kỹ năng đọc hiểu của học viên tốt. Học viên có khả năng chọn lọc và sắp xếp thông tin, diễn đạt thông tin theo nhiều cách khác nhau.',
        'Học viên nắm được các cấu trúc ngữ pháp phức tạp, có thể viết câu hoàn chỉnh và đúng ngữ pháp.',
      ],
      improve:
        'Kỹ năng đọc viết của học viên sẽ được nâng cao đáng kể khi học viên luyện đọc thêm với những bài đọc dài với từ vựng nâng cao và cấu trúc được sử dụng đa dạng, phức tạp. Học viên cũng cần luyện tập viết các đoạn văn Tiếng Anh có độ dài từ 50-80 từ để nâng cao khả năng sử dụng ngôn ngữ.',
    };
  }
};

export const dataTotal = (score: number): ResultData => {
  if (score <= 4) {
    return {
      comment: 'Trình độ của học viên ở mức Tiền căn bản',
      improve:
        'Học viên nên bắt đầu việc học Tiếng Anh theo một lộ trình bài bản, gồm cả 4 kỹ năng và kết hợp việc nâng cao vốn từ vựng thông qua các bài học từ vựng theo chủ đề. Học viên cũng nên kết hợp các bài ngữ pháp tiếng Anh cơ bản. Học sinh học các kỹ năng làm bài 4 kỹ năng cơ bản.',
      course: 'Khóa học đề xuất: Starters (đầu ra Pre-A1)',
    };
  } else if (score >= 5 && score <= 12) {
    return {
      comment: 'Trình độ của học viên ở mức Căn bản',
      improve:
        'Học viên nên bắt đầu việc học Tiếng Anh theo một lộ trình bài bản, gồm cả 4 kỹ năng và kết hợp việc nâng cao vốn từ vựng thông qua các bài học từ vựng theo chủ đề. Học viên cũng nên kết hợp các bài ngữ pháp tiếng Anh cơ bản. Học sinh học các kỹ năng làm bài 4 kỹ năng cơ bản.',
      course: 'Khóa học đề xuất: Starters (đầu ra Pre-A1)',
    };
  } else if (score >= 13 && score <= 20) {
    return {
      comment:
        'Trình độ của học viên ở mức Pre-A1 theo thang đánh giá trình độ của Cambridge',
      improve:
        'Học viên nên nâng cao năng lực Tiếng Anh bằng một lộ trình bài bản, gồm cả 4 kỹ năng và kết hợp việc nâng cao vốn từ vựng thông qua các bài học từ vựng theo chủ đề và chủ điểm ngữ pháp tiếng Anh đa dạng hơn. Học sinh phát triển thêm các kỹ năng làm bài 4 kỹ năng.',
      course: 'Khóa học đề xuất: Movers (đầu ra A1)',
    };
  } else if (score >= 21 && score <= 26) {
    return {
      comment:
        'Trình độ của học viên ở mức A1 (đầu A1) theo thang đánh giá trình độ của Cambridge',
      improve:
        'Học viên có thể cải thiện năng lực tiếng Anh thông qua một lộ trình học bài bản gồm cả 4 kỹ năng (nghe, nói, đọc, viết), kết hợp với các bài học từ vựng theo chủ đề đa dạng, mở rộng hơn và bài học ngữ pháp có độ khó cao hơn. Học sinh phát triển thêm các kỹ năng làm bài 4 kỹ năng.',
      course:
        'Khóa học đề xuất: Flyers (đầu ra A2 theo bậc dành cho học sinh tiểu học)',
    };
  } else {
    return {
      comment:
        'Trình độ của học viên ở mức A1 (cuối A1) theo thang đánh giá trình độ của Cambridge',
      improve:
        'Học viên có thể cải thiện năng lực tiếng Anh thông qua một lộ trình học bài bản gồm cả 4 kỹ năng (nghe, nói, đọc, viết), kết hợp với các bài học từ vựng theo chủ đề đa dạng, mở rộng hơn và bài học ngữ pháp có độ khó cao hơn, các bài tập 4 kỹ năng ứng dụng sự suy luận cao hơn về các chủ đề xã hội.',
      course:
        'Khóa học đề xuất: Elementary - Easy PASS (Prepare) (đầu ra A2 theo bậc dành cho học sinh THCS)',
    };
  }
};

