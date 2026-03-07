export type Language = 'bg' | 'en';

export const content = {
  bg: {
    nav: {
      services: 'Услуги',
      fleet: 'Автомобили',
      about: 'За нас',
      reviews: 'Отзиви',
      faq: 'ЧЗВ',
      contact: 'Контакти',
      login: 'Вход',
      signup: 'Регистрация',
    },
    hero: {
      badge: 'Работим денонощно',
      title: 'Премиум трансфери от/до хотели, летища и всяка точка в страната',
      subtitle: 'Надежден, комфортен и безопасен транспорт 24/7 – винаги навреме, винаги с усмивка.',
      intro: 'Добре дошли при вашия доверен партньор за професионални трансфери. Предлагаме удобен и сигурен транспорт от и до летища, хотели, бизнес адреси и туристически дестинации. Работим денонощно, за да осигурим максимално комфортно пътуване за вас, вашите клиенти или гости.',
    },
    booking: {
      title: 'Резервирайте своя трансфер за минути',
      desc: 'Нашата онлайн форма позволява бърза и лесна резервация. Попълнете нужната информация, изберете автомобил и потвърдете. Ние ще се свържем с вас за детайли и потвърждение.',
      pickup: 'Вземане от (адрес, хотел, летище)',
      dropoff: 'Дестинация',
      date: 'Дата',
      time: 'Час',
      search: 'Търсене',
      includesTitle: 'Какво включва резервацията:',
      includes: [
        'Вземане от адрес, хотел или летище',
        'Помощ с багаж',
        'Следене на полети при летищни трансфери',
        'Възможност за допълнителни услуги',
        'Гарантиран комфорт и безопасност'
      ]
    },
    advantages: {
      title: 'Основни предимства',
      items: [
        'Фиксирани и прозрачни цени',
        'Професионални и учтиви шофьори',
        'Комфортни и поддържани автомобили',
        'Проследяване на полети и гъвкавост при закъснения',
        '24/7 наличност и експресна резервация'
      ]
    },
    services: {
      title: 'Услуги',
      items: [
        {
          title: 'Летищни трансфери',
          desc: 'Предоставяме бърз и удобен транспорт до всички летища в страната. Нашите шофьори следят статуса на полетите, за да осигурят точно посрещане, независимо от закъснения.'
        },
        {
          title: 'Хотелски трансфери',
          desc: 'Осигуряваме прецизен трансфер от и до хотели, апартаменти и курорти. Идеално решение за туристи, бизнес гости и групи.'
        },
        {
          title: 'Междуградски трансфери',
          desc: 'Пътувайте комфортно между градовете, без чакане, без прехвърляне и без стрес. Подходящо за работа, почивка или специални поводи.'
        },
      ],
      learnMore: 'Научете повече'
    },
    fleet: {
      title: 'Нашите автомобили',
      desc: 'Пътувайте комфортно и сигурно с нашия модерен автопарк. Всички автомобили са редовно обслужвани, чисти и оборудвани с необходимите удобства.',
      items: [
        {
          class: 'Mercedes C Class – Комфорт и сигурност',
          desc: 'Идеален за индивидуални пътувания или двойки.',
          features: ['До 3 пътници', 'Климатик, USB, Wi-Fi', 'Просторно багажно отделение']
        },
        {
          class: 'Opel Vivaro – За семейства и групи',
          desc: 'Перфектен избор за повече хора и багаж.',
          features: ['До 7 пътници', 'Простор и удобство', 'Допълнителни опции за багаж']
        },
        {
          class: 'Mercedes Vito – Премиум комфорт',
          desc: 'Луксозни автомобили за специални гости и бизнес клиенти.',
          features: ['Кожа, тишина и максимален комфорт', 'Професионално обслужване', 'До 3 пътници']
        }
      ]
    },
    about: {
      title: 'За нас',
      whoWeAreTitle: 'Кои сме ние',
      whoWeAre: 'Ние сме екип от професионални шофьори, посветени на комфорта и сигурността на нашите клиенти. С дългогодишен опит в сферата на транспорта, предлагаме висок стандарт на обслужване и индивидуален подход.',
      missionTitle: 'Нашата мисия',
      mission: 'Да предоставим надежден, качествен и достъпен транспорт за всеки. С нас пътуването е спокойно, навременно и приятно.',
      valuesTitle: 'Нашите ценности:',
      values: ['Професионализъм', 'Доверие', 'Отговорност', 'Комфорт']
    },
    reviews: {
      title: 'Какво казват нашите клиенти',
      items: [
        { text: '„Страхотно обслужване! Шофьорът беше точен и много учтив. Препоръчвам.“', author: 'Клиент' },
        { text: '„Колата беше чиста и удобна. Ще използвам отново.“', author: 'Клиент' },
        { text: '„Най-добрият транспорт, който съм ползвал. Благодарности!“', author: 'Клиент' }
      ]
    },
    faq: {
      title: 'Често задавани въпроси (FAQ)',
      items: [
        {
          q: 'Какво се случва, ако полетът ми закъснее?',
          a: 'Следим полетите в реално време и се съобразяваме с актуалния час на кацане. Не се доплаща за закъснение.'
        },
        {
          q: 'Предлагате ли детски седалки?',
          a: 'Да, при заявка предварително.'
        },
        {
          q: 'Как се изчислява цената?',
          a: 'Цената се изчислява само въз основа на вида автомобил и изминатото разстояние. Можете да получите точна цена чрез нашия калкулатор или като се свържете с нас.'
        },
        {
          q: 'Предлагате ли вода по време на пътуването?',
          a: 'Всички автомобили разполагат с безплатна бутилирана вода за пътниците.'
        },
        {
          q: 'Какви методи на плащане приемате?',
          a: 'В брой и Revolut'
        }
      ]
    },
    contact: {
      title: 'Свържете се с нас',
      desc: 'Имате въпрос или желание за резервация? Ще се радваме да помогнем!',
      phone: '+359 882 545 355',
      email: 'transprime17@gmail.com',
      address: 'Адрес',
      workingHours: 'Работно време',
      workingHoursValue: '24/7',
      formTitle: 'Форма за контакт',
      formDesc: 'Оставете съобщение и ние ще се свържем с вас до няколко минути.',
      send: 'Изпрати',
      topCities: 'Топ Градове',
      company: 'Компания',
      rights: 'Всички права запазени.',
      terms: 'Условия за ползване',
      privacy: 'Политика за поверителност',
      imprint: 'Импринт',
      paymentTitle: 'Методи на плащане',
      paymentMethods: 'В брой, Revolut'
    }
  },
  en: {
    nav: {
      services: 'Services',
      fleet: 'Fleet',
      about: 'About Us',
      reviews: 'Reviews',
      faq: 'FAQ',
      contact: 'Contact',
      login: 'Log in',
      signup: 'Sign up',
    },
    hero: {
      badge: 'Operating 24/7',
      title: 'Premium transfers to/from hotels, airports, and anywhere in the country',
      subtitle: 'Reliable, comfortable, and safe transport 24/7 – always on time, always with a smile.',
      intro: 'Welcome to your trusted partner for professional transfers. We offer convenient and secure transport to and from airports, hotels, business addresses, and tourist destinations. We operate around the clock to ensure the most comfortable journey for you, your clients, or your guests.',
    },
    booking: {
      title: 'Book your transfer in minutes',
      desc: 'Our online form allows for quick and easy booking. Fill in the required information, choose a vehicle, and confirm. We will contact you with details and confirmation.',
      pickup: 'Pick-up (address, hotel, airport)',
      dropoff: 'Drop-off location',
      date: 'Date',
      time: 'Time',
      search: 'Search',
      includesTitle: 'What the booking includes:',
      includes: [
        'Pick-up from an address, hotel, or airport',
        'Luggage assistance',
        'Flight tracking for airport transfers',
        'Options for additional services',
        'Guaranteed comfort and safety'
      ]
    },
    advantages: {
      title: 'Key Advantages',
      items: [
        'Fixed and transparent prices',
        'Professional and polite drivers',
        'Comfortable and well-maintained vehicles',
        'Flight tracking and flexibility for delays',
        '24/7 availability and express booking'
      ]
    },
    services: {
      title: 'Services',
      items: [
        {
          title: 'Airport Transfers',
          desc: 'We provide fast and convenient transport to all airports in the country. Our drivers monitor flight statuses to ensure precise pick-ups, regardless of delays.'
        },
        {
          title: 'Hotel Transfers',
          desc: 'We ensure precise transfers to and from hotels, apartments, and resorts. The ideal solution for tourists, business guests, and groups.'
        },
        {
          title: 'Intercity Transfers',
          desc: 'Travel comfortably between cities without waiting, without transfers, and without stress. Suitable for work, leisure, or special occasions.'
        },
      ],
      learnMore: 'Learn more'
    },
    fleet: {
      title: 'Our Vehicles',
      desc: 'Travel comfortably and safely with our modern fleet. All vehicles are regularly serviced, clean, and equipped with the necessary amenities.',
      items: [
        {
          class: 'Mercedes C Class – Comfort and Safety',
          desc: 'Ideal for individual travel or couples.',
          features: ['Up to 3 passengers', 'Air conditioning, USB, Wi-Fi', 'Spacious luggage compartment']
        },
        {
          class: 'Opel Vivaro – For Families and Groups',
          desc: 'The perfect choice for more people and luggage.',
          features: ['Up to 7 passengers', 'Space and convenience', 'Additional luggage options']
        },
        {
          class: 'Mercedes Vito – Premium Comfort',
          desc: 'Luxury vehicles for special guests and business clients.',
          features: ['Leather, quietness, and maximum comfort', 'Professional service', 'Up to 3 passengers']
        }
      ]
    },
    about: {
      title: 'About Us',
      whoWeAreTitle: 'Who We Are',
      whoWeAre: 'We are a team of professional drivers dedicated to the comfort and safety of our clients. With years of experience in the transport sector, we offer a high standard of service and a personalized approach.',
      missionTitle: 'Our Mission',
      mission: 'To provide reliable, high-quality, and accessible transport for everyone. With us, traveling is calm, timely, and pleasant.',
      valuesTitle: 'Our Values:',
      values: ['Professionalism', 'Trust', 'Responsibility', 'Comfort']
    },
    reviews: {
      title: 'What Our Clients Say',
      items: [
        { text: '"Great service! The driver was punctual and very polite. Highly recommended."', author: 'Client' },
        { text: '"The car was clean and comfortable. Will use again."', author: 'Client' },
        { text: '"The best transport I have used. Thank you!"', author: 'Client' }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions (FAQ)',
      items: [
        {
          q: 'What happens if my flight is delayed?',
          a: 'We monitor flights in real-time and adjust to the actual landing time. There is no extra charge for delays.'
        },
        {
          q: 'Do you provide child seats?',
          a: 'Yes, upon prior request.'
        },
        {
          q: 'How is the price calculated?',
          a: 'The price is calculated only based on the vehicle type and the travel distance. You can get an exact price through our calculator or by contacting us.'
        },
        {
          q: 'Do vehicles provide water?',
          a: 'All vehicles include free bottled water for passengers.'
        },
        {
          q: 'What payment methods are accepted?',
          a: 'Cash & Revolut'
        }
      ]
    },
    contact: {
      title: 'Contact Us',
      desc: 'Have a question or want to make a booking? We\'d be happy to help!',
      phone: '+359 882 545 355',
      email: 'transprime17@gmail.com',
      address: 'Address',
      workingHours: 'Working Hours',
      workingHoursValue: '24/7',
      formTitle: 'Contact Form',
      formDesc: 'Leave a message and we will get back to you in a few minutes.',
      send: 'Send',
      topCities: 'Top Cities',
      company: 'Company',
      rights: 'All rights reserved.',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      imprint: 'Imprint',
      paymentTitle: 'Accepted Payments',
      paymentMethods: 'Cash, Revolut'
    }
  }
};
