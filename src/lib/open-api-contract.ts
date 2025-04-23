import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { extendZodWithOpenApi } from '@anatine/zod-openapi'
import { teamSchema } from '@/interfaces'

extendZodWithOpenApi(z)

const c = initContract()

const brazilianLegueTable = c.router({
  getBrazilianLeagueTable: {
    method: 'GET',
    path: '/brazilian-league',
    summary: 'Get the Brazilian league table',
    responses: {
      200: z.array(teamSchema),
      204: c.noBody(),
    },
    metadata: { tags: 'brazilian-league' } as const,
  },
})

const brazueraoLegueTable = c.router({
  getBrazueraoBetLeagueTable: {
    method: 'GET',
    path: '/brazuerao-league/:year',
    pathParams: z.object({
      year: z.number().openapi({
        description: 'The year of the league',
      }),
    }),
    responses: {
      200: z.object({
        range: z.string().openapi({
          title: 'range',
          description: 'Range of sheet',
        }),
        majorDimension: z.string().optional().openapi({
          title: 'majorDimension',
          description: 'Cells of sheet',
        }),
        values: z
          .array(z.array(z.string().or(z.number()).or(z.null())))
          .optional()
          .openapi({
            title: 'values',
            description: 'Line values of sheet',
          }),
      }),
      204: c.noBody(),
      400: z.object({ message: z.string(), reason: z.string() }).openapi({
        title: 'Bad Request',
        description: 'Bad Request schema',
        examples: [
          {
            value: {
              message: 'unknown error',
              reason: 'unknown',
            },
            summary: 'Example of a unknown error',
          },
          {
            value: {
              message: 'Invalid parameter: year',
              reason: 'invalid_parameter',
            },
            summary: 'Example of a invalid parameter',
          },
        ],
      }),
    },
  },
})

export const apiContract = c.router(
  {
    'brazilian-league': brazilianLegueTable,
    'brazueirao-league': brazueraoLegueTable,
  },
  {
    pathPrefix: '/api/v1',
    commonResponses: {
      404: z.object({ message: z.string(), reason: z.string() }).openapi({
        title: 'Bad Request',
        description: 'Bad Request schema',
        examples: [
          {
            value: {
              message: 'Not Found',
              reason: 'unknown',
            },
            summary: 'Example of a not found error',
          },
        ],
      }),
      500: c.otherResponse({
        contentType: 'application/json',
        body: z.literal('Server Error'),
      }),
    },
  }
)
