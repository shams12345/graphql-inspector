import {buildSchema, Source, print, parse} from 'graphql';

import {validate} from '../../src/validate';

describe('apollo', () => {
  test('should remove a filed with @client', () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
      }

      type Query {
        post: Post
      }
    `);

    const doc = parse(/* GraphQL */ `
      query getPost {
        post {
          id
          title
          extra @client
        }
      }
    `);

    const results = validate(schema, [new Source(print(doc))], {
      apollo: true,
    });

    expect(results).toHaveLength(0);
  });

  test('should include @connection', () => {
    const schema = buildSchema(/* GraphQL */ `
      type Post {
        id: ID
        title: String
        comments: [String]
      }

      type Query {
        post(id: ID!): Post
      }
    `);

    const doc = parse(/* GraphQL */ `
      query getPost {
        post(id: 1) {
          id
          title
          comments @connection(key: "comments")
        }
      }
    `);

    const results = validate(schema, [new Source(print(doc))], {
      apollo: true,
    });

    expect(results).toHaveLength(0);
  });
});
