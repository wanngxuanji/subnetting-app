export type Language = 'vi' | 'en' | 'zh';

export const translations = {
  vi: {
    hello: 'Xin chào!',
    selectLang: 'Vui lòng chọn ngôn ngữ để bắt đầu:',
    theory: 'THEORY',
    practice: 'PRACTICE',
    calc: 'CALCULATOR',
    viewRepo: 'View Repo',
    lang: 'NGÔN NGỮ',
    start: 'BẮT ĐẦU NGAY',
    confirm: 'XÁC NHẬN CHỌN',
    // ... basic translations
  },
  en: {
    hello: 'Hello!',
    selectLang: 'Please select your language to start:',
    theory: 'THEORY',
    practice: 'PRACTICE',
    calc: 'CALCULATOR',
    viewRepo: 'View Repo',
    lang: 'LANGUAGE',
    start: 'START NOW',
    confirm: 'CONFIRM',
  },
  zh: {
    hello: '你好！',
    selectLang: '请选择您的语言以开始：',
    theory: '理论 (THEORY)',
    practice: '练习 (PRACTICE)',
    calc: '计算器 (CALCULATOR)',
    viewRepo: '查看仓库',
    lang: '语言',
    start: '现在开始',
    confirm: '确认',
  }
};
