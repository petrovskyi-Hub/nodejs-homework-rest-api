const User = {
  _id: '6048a797fc36d1126459d17a',
  subscription: 'pro',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDhhNzk3ZmMzNmQxMTI2NDU5ZDE3YSIsImlhdCI6MTYxNTczMzkzNCwiZXhwIjoxNjE1NzQxMTM0fQ.3TkRVmHhvCD0NNyh7SgiryDf1JOuuACfcMLYSRbEWNk',
  email: 'example@example.com',
  password: '$2a$08$ikXhLV.22FJprOI5HrxKwOdLwmaoZn/8CziO.UAull.RltHOtNAvC',
  avatarURL: '6048a797fc36d1126459d17a\\1615738381209-photo.jpg',
};

const users = [];
users[0] = User;

const newUser = { email: 'test@test.com', password: '1234567' };

const contacts = [
  {
    _id: '60423455265ddc184c7cb839',
    subscription: 'free',
    name: 'Nina Matvienko',
    email: 'mail_1@mail.com',
    phone: '(050) 234-6685',
    owner: '6048a797fc36d1126459d17a',
  },
  {
    _id: '6042346b265ddc184c7cb83b',
    subscription: 'pro',
    name: 'Simon Morton',
    email: 'dui.Fusce.diam@Donec.com',
    phone: '(233) 738-2360',
    owner: '6048a797fc36d1126459d17a',
  },
];

const newContact = {
  name: 'Test',
  email: 'test@gmail.com',
  phone: '(066) 111-4444',
  subscription: 'premium',
};

module.exports = { User, users, newUser, contacts, newContact };
