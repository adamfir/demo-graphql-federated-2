import path from "path";
import fs from "fs";
import { DocumentNode } from "graphql";
import { gql } from "apollo-server";

// readGraphqlFiles extract all graphql schema from the directory
// read all files with .graphql extension
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

// export the schema
export default graphqlSchemas;