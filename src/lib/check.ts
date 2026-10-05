import { getPayload } from 'payload'
import config from '../../payload.config'

const check = async () => {
  const payload = await getPayload({ config })
  const articles = await payload.find({
    collection: 'articles',
    limit: 1,
    depth: 1,
  })

  console.log(JSON.stringify(articles.docs[0], null, 2))
  process.exit(0)
}

check()
