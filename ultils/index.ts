import axios, { AxiosResponse } from 'axios';

export const getPartner = (id: number): string | undefined => {
  switch (true) {
    case id == 0:
      return process.env.HSA_URL;
    case id == 1:
      return process.env.TSA_URL;
    case id == 2:
      return;
    case id == 3:
      return;
    case id == 4:
      return process.env.TSA_URL;
    case id == 5:
      return process.env.DGNL_HM_URL;
    case id == 6:
      return;
    case id == 7:
      return process.env.HCM_URL;
    case id == 8:
      return process.env.HCM_URL;
    case id == 9:
      return process.env.TSA_URL;
    default:
      return;
  }
};

export const alphabet = (): string[] => {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map(x => String.fromCharCode(x));
  return alphabet;
};

export const getNameUser = (lastName?: string | null, firstName?: string | null, hide_nubmer: boolean = false): string => {
  let fullName =
    (lastName && lastName != null ? lastName + ' ' : '') +
    (firstName && firstName != null ? firstName : '');

  fullName = fullName != '' ? fullName : 'Anonymous';

  if (hide_nubmer && checkPhoneNumber(fullName)) {
    fullName = fullName.replace(
      fullName.substring(0, fullName.length - 3),
      'SĐT đuôi ',
    );
  }
  return fullName;
};

function checkPhoneNumber(p: string): boolean {
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  var phoneRe = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  var digits = p.replace(/\D/g, '');
  const matchResult = digits.match(/\d/g);
  return (
    phoneRe.test(digits) && matchResult !== null && matchResult.length == 10 && p.charAt(0) == '0'
  );
}

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const regexPatterns: Record<string, RegExp> = {
    Viettel: /^(086|096|097|098|032|033|034|035|036|037|038|039)\d{7}$/,
    Vinaphone: /^(088|091|094|083|084|085|081|082)\d{7}$/,
    Mobifone: /^(089|090|093|070|079|077|076|078)\d{7}$/,
    Vietnammobile: /^(092|052|056|058)\d{7}$/,
  };

  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  for (const [network, pattern] of Object.entries(regexPatterns)) {
    if (pattern.test(cleanedPhoneNumber)) return true;
  }

  return false;
};

export const getRank = (
  limit: number = 5,
  page: number = 1,
  idProduct: string | null = null,
  timePick: Date | null = null,
  idMockContest: string | null = null,
): Promise<AxiosResponse> => {
  let strIdMockContest = idMockContest ? `&idMockContest=${idMockContest}` : '';
  let strIdProduct = idProduct ? `&idProduct=${idProduct}` : '';
  let strYear = '';
  let strMonth = '';
  if (timePick) {
    strYear = `&year=${timePick.getFullYear()}`;
    strMonth = `&month=${timePick.getMonth() + 1}`;
  }
  return axios.get(
    `/apitopclass/v1/rank/topclass?apikey=${
      process.env.EXAM_PORTAL_APIKEY
    }&limit=${limit}&page=${page}${
      strIdProduct + strIdMockContest + strYear + strMonth
    }`,
  );
};

export const getUserOnline = (limit: number = 5, page: number = 1): Promise<AxiosResponse> => {
  return axios.get(
    `/apitopclass/v1/auth/getonline?apikey=${process.env.EXAM_PORTAL_APIKEY}&limit=${limit}&page=${page}`,
  );
};

export const setColorMark = ($mark: number, $maxMark: number): string => {
  let $percent = ($mark / ($maxMark == 0 ? 1 : $maxMark)) * 100;
  if ($percent <= 30) {
    return '#FF2626'; // RED #FF2626
  }
  if ($percent > 30 && $percent <= 70) {
    return '#FFD629'; // YELLOW FFD629
  }
  if ($percent > 70) {
    return '#59CE32'; // GREEN #59CE32
  }
  return '#59CE32'; // Default GREEN
};

interface TimeString {
  year: number;
  month: string;
  date: string;
  day: string;
  hours: number;
  ampm: string;
  minutes: string;
  seconds: string;
  hoursConvert: string;
}

export const formatTimeString = (dateISO: string): TimeString => {
  const dateConverted = new Date(dateISO);
  let hours = dateConverted.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursConvert = `0${dateConverted.getHours()}`.slice(-2);
  const minutes = `0${dateConverted.getMinutes()}`.slice(-2);
  const seconds = `0${dateConverted.getSeconds()}`.slice(-2);
  const date = `0${dateConverted.getDate()}`.slice(-2);
  const month = `0${dateConverted.getMonth() + 1}`.slice(-2);
  const year = dateConverted.getFullYear();
  const currentDay = dateConverted.getDay();
  
  const convertDay = (currentDay: number): string => {
    switch (currentDay) {
      case 0:
        return 'Chủ nhật';
      case 1:
        return 'Thứ hai';
      case 2:
        return 'Thứ ba';
      case 3:
        return 'Thứ tư';
      case 4:
        return 'Thứ năm';
      case 5:
        return 'Thứ sáu';
      case 6:
        return 'Thứ bảy';
      default:
        return '';
    }
  };
  
  const day = convertDay(currentDay);
  return {
    year,
    month,
    date,
    day,
    hours,
    ampm,
    minutes,
    seconds,
    hoursConvert,
  };
};

export const secondsToHms = (seconds: number, format: string = 'h:i:s'): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  let timeString = '';
  if (format === 'h:i:s') {
    timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else if (format === 'i:s') {
    const newMinutes = hours * 60 + minutes;
    timeString = `${newMinutes
      .toString()
      .padStart(2, '0')} phút ${formattedSeconds} giây`;
  }

  return timeString;
};

