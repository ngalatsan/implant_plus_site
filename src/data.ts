import prices from './prices.json';

export const clinic = {
  name: 'ИМПЛАНТ+',
  city: 'Анапа',
  address: 'г. Анапа, ул. Ленина, 187',
  phone: '+7 (918) 470-74-55',
  phoneHref: 'tel:+79184707455',
  hours: 'Пн–Сб 09:00–18:00',
  dayOff: 'Вс — выходной',
  maps: 'https://yandex.ru/maps/org/implant_/180439177499/',
  max: 'https://max.ru/u/f9LHodD0cOKOq9D_jXH18_IDYHjV2sSz4gPGRsuP6xecbNAo8Wc5O9YHJV8',
  mapEmbed: 'https://yandex.ru/map-widget/v1/?ll=37.331651%2C44.873571&z=16&pt=37.331651,44.873571,pm2rdm&l=map',
};

export const navigation = [
  { href: '#about', label: 'О клинике' },
  { href: '#services', label: 'Услуги и цены' },
  { href: '#doctors', label: 'Врачи' },
  { href: '#clinic', label: 'Интерьер' },
  { href: '#contacts', label: 'Контакты' },
];

export const doctors = [
  {
    name: 'Кысса Андрей Петрович',
    surname: 'Кысса',
    firstName: 'Андрей Петрович',
    role: 'Врач-стоматолог, хирург-имплантолог, ортопед',
    experience: 'Стаж 10 лет',
    description: 'Регулярно обучается в сфере стоматологии.',
    photo: '/images/IMG_20261005_192237_470.jpg',
  },
  {
    name: 'Кысса Виктор Петрович',
    surname: 'Кысса',
    firstName: 'Виктор Петрович',
    role: 'Врач-стоматолог общей практики',
    experience: 'Стаж более 3 лет',
    description: 'Осваивает передовые технологии.',
    photo: '/images/IMG_20261005_194751_167.jpg',
  },
];

export const services = [
  { title: 'Имплантация', description: 'Восстановление утраченных зубов. Имплантация одного зуба и решения «всё на 4» и «всё на 6».', price: 20000, category: 'implants' },
  { title: 'Протезирование', description: 'Восстановление формы и функции зубов. Коронки на зубы и имплантаты, ортопедические конструкции.', price: 12500, category: 'ortho' },
  { title: 'Лечение зубов', description: 'Лечение кариеса и его осложнений. Реставрация зубов фотополимерными материалами.', price: 3500, category: 'therapy' },
];

export const gallery = [
  { src: '/images/IMG_20261005_164121_203.jpg', title: 'Зона ожидания' },
  { src: '/images/IMG_20261005_164121_136.jpg', title: 'Пространство клиники' },
  { src: '/images/IMG_20261005_164120_448.jpg', title: 'Стоматологический кабинет' },
  { src: '/images/IMG_20261005_164120_667.jpg', title: 'Оснащение кабинета' },
  { src: '/images/IMG_20261005_164121_158.jpg', title: 'Кабинет для приёма' },
];

export { prices };
export const formatPrice = (price: number) => `${new Intl.NumberFormat('ru-RU').format(price)} ₽`;
