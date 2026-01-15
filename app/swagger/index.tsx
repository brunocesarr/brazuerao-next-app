'use client'

import { getApiDocs } from '@/lib/swagger'
import 'swagger-ui-react/swagger-ui.css'

import dynamic from 'next/dynamic'

const DynamicSwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <p>Loading Swagger...</p>,
})

const ApiDoc = () => {
  return (
    <DynamicSwaggerUI
      spec={getApiDocs()}
      displayRequestDuration
      displayOperationId
      docExpansion="list"
      tryItOutEnabled
    />
  )
}

export default ApiDoc
