import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }

  type Query {
    course(id: Int!): Course
    coursesByPartialTitle(partialTitle: String): [Course]
    courses(topic: String): [Course]
  }

  input CourseInput {
    title: String
    author: String
    description: String
    topic: String
    url: String
  }

  type Mutation {
    updateCourseTopic(id: Int!, topic: String!): Course
    addCourse(course: CourseInput): [Course]
  }
`;

interface CourseData {
  id: number;
  title: string | null;
  author: string | null;
  description: string | null;
  topic: string | null;
  url: string | null;
}

const coursesList: Array<CourseData> = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: "Andrew Mead, Rob Percival",
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/",
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: "Brad Traversy",
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/",
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: "Anthony Alicea",
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/",
  },
];

const resolvers = {
  Query: {
    courses: (_: unknown, { topic }: { topic?: string }) =>
      topic ? coursesList.filter((el) => el.topic === topic) : coursesList,
    coursesByPartialTitle: (
      _: unknown,
      { partialTitle }: { partialTitle: string }
    ) =>
      coursesList.filter(({ title }) => title && title.includes(partialTitle)),
    course: (_: unknown, { id }: { id: number }) =>
      coursesList.find((el) => el.id === id) ?? null,
  },
  Mutation: {
    updateCourseTopic: (
      _: unknown,
      { id, topic }: { id: number; topic: string }
    ) => {
      const currIndex = coursesList.findIndex((el) => el.id === id);
      if (currIndex < 0) return null;
      const currCourse = coursesList[currIndex];
      currCourse.topic = topic;
      return currCourse;
    },
    addCourse: (_: unknown, { course }: { course: CourseData }) => {
      if (!course) return null;
      const { id: lastId } = coursesList[coursesList.length - 1];
      coursesList.push({ ...course, id: lastId + 1 });
      return coursesList;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
