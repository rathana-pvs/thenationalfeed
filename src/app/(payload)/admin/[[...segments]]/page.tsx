import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { Metadata } from 'next'
import configPromise from '@payload-config'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> => {
  return generatePageMetadata({ config: configPromise, params, searchParams })
}

export default function Page({ params, searchParams }: Args) {
  return RootPage({ config: configPromise, importMap, params, searchParams })
}
