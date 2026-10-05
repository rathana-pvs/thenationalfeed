import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

/* This is a reference to your imported config module */
import configPromise from '@payload-config'
import { importMap } from './admin/importMap.js'
import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const serverFunction = async function (args: any) {
  'use server'
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  })
}

export default function Layout({ children }: Args) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){ document.documentElement.setAttribute('data-theme', 'dark'); try { localStorage.setItem('payload-theme', 'dark'); } catch(e){} })();`,
        }}
      />
      <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
        {children}
      </RootLayout>
    </>
  )
}
