import { generateOpenApi } from '@ts-rest/open-api'
import { apiContract } from './open-api-contract'
import {
  brazueraoSpreadSheetOpenApiSchema,
  teamOpenApiSchema,
} from '@/interfaces/api/schemas'

export const getApiDocs = () => {
  const apiDoc = generateOpenApi(
    apiContract,
    {
      swagger: '3.1.0',
      info: {
        title: 'Brazuerao API - Documentation',
        version: '1.0',
        description: 'API Documentation for Brazuerao.',
        termsOfService: 'http://swagger.io/terms/',
        contact: {
          name: 'Brazuerao API',
          email: 'brazuerao@gmail.com',
        },
        license: {
          name: 'Apache 2.0',
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
      },
      components: {
        schemas: {
          Team: teamOpenApiSchema,
          BrazueraoSpreadSheet: brazueraoSpreadSheetOpenApiSchema,
        },
      },
      basePath: '/api',
      tags: [
        {
          name: 'brazilian-league',
          description: 'Everything about your braizilian league',
        },
        {
          name: 'brazueirao-league',
          description: 'Access to Brazuerao info',
        },
      ],
      schemes: ['https', 'http'],
    },
    {
      setOperationId: true,
      jsonQuery: true,
    }
  )

  return apiDoc
}
