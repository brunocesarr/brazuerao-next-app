import { getApiDocs } from '@/lib/swagger'
import ReactSwagger from '@/components/Swagger/react-swagger'

function ApiDoc() {
  return (
    <section className="container">
      <ReactSwagger spec={getApiDocs()} />
    </section>
  )
}

export default ApiDoc
