import path from "path";
import fs from "fs";
import { DocumentNode } from "graphql";
import { gql } from "apollo-server";
import { authDirectiveTypeDefs } from "../directive/auth";

// readGraphqlFiles extract all graphql schema from the directory
// read all files with .graphql extension
// temporary solution to include all .graphql files to output dir:
// https://github.com/ardatan/graphql-tools/issues/273#issuecomment-444315458
function readGraphqlFiles(inputDir?: string) : DocumentNode[] {
  const graphqlSchemas: DocumentNode[] = [];
  const currentDir = inputDir || __dirname;
  const contents = fs.readdirSync(currentDir);
  contents.forEach(File => {
      const absolute = path.join(currentDir, File);
      if (fs.statSync(absolute).isDirectory()) {
        return graphqlSchemas.push(...readGraphqlFiles(absolute));
      } else {
        if (File.endsWith(".graphql")) {
          const schema = fs.readFileSync(absolute, "utf8")
          graphqlSchemas.push(gql`${schema}`);
        }
        return
      }
  });

  return graphqlSchemas;
}

const graphqlSchemas = readGraphqlFiles();
// inject @auth directive
graphqlSchemas.push(gql`${authDirectiveTypeDefs}`)

// export the schema
export default graphqlSchemas;