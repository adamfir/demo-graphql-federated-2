import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { GraphQLSchema, defaultFieldResolver } from 'graphql'

function getUser(userRoles: string[]) {
  userRoles = userRoles.map(userRole => (userRole.toUpperCase()));
  return {
    hasRole: (role: string | string[]) => {
      if (!userRoles) {
        return false;
      }
      if (typeof role === 'string') {
        return userRoles.includes(role.toUpperCase()) || false;
      }
      role = role.map(userRole => (userRole.toUpperCase()))
      return userRoles.some(userRole => role.includes(userRole)) || false;
    },

  }
}


function authDirective(directiveName: string, getUserFn: (userRoles: string[]) => { hasRole: (role: string | string[]) => boolean }) {
  const typeDirectiveArgumentMaps: Record<string, any> = {}
  return {
    authDirectiveTypeDefs: `directive @${directiveName}(
      requires: [Role],
    ) on OBJECT | FIELD_DEFINITION | INPUT_FIELD_DEFINITION | QUERY | MUTATION`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: type => {
          const authDirective = getDirective(schema, type, directiveName)?.[0]
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective
          }
          return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName]
          if (authDirective) {
            const { requires } = authDirective
            if (requires) {
              const { resolve = defaultFieldResolver } = fieldConfig
              fieldConfig.resolve = function (source, args, context, info) {
                const user = getUserFn(context.roles)
                if (!user.hasRole(requires)) {
                  throw new Error('not authorized')
                }
                return resolve(source, args, context, info)
              }
              return fieldConfig
            }
          }
        }
      })
  }
}

export const { authDirectiveTransformer, authDirectiveTypeDefs } = authDirective('auth', getUser);