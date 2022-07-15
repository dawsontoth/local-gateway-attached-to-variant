const awards = [
  {
    bookTitle: 'title1',
    title: 'title',
    year: 1234,
    authorName: 'authors name 1',
    awardTitle: 'award title 1',
    awardName: 'award name 1',
  },
  {
    bookTitle: 'title 2',
    title: 'title 2',
    year: 1234,
    authorName: 'authors name 2',
    awardTitle: 'award title 2',
    awardName: 'award name 2',
  },
  {
    bookTitle: 'title 3',
    title: 'title 3',
    year: 1234,
    authorName: 'authors name 3',
    awardTitle: 'award title 3',
    awardName: 'award name 3',
  },
];

export const resolvers = {
  Query: {
    awards() {
      return awards;
    },
  },

  Author: {
    awards() {
      return awards;
    },
  },
};
