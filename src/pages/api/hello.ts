// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// 👋 We could actually delete this but just fyi here we could fetch data in future

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
