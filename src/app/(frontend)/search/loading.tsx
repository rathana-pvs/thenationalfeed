import React from 'react'

export default function SearchLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12 animate-in fade-in duration-500">
      <div className="mb-12">
        <div className="w-64 h-10 skeleton mb-4" />
        <div className="w-48 h-4 skeleton" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Filters sidebar */}
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-4">
            <div className="w-32 h-4 skeleton" />
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 skeleton rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="lg:col-span-9">
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-border">
                <div className="md:w-64 aspect-[16/10] skeleton rounded-xl shrink-0" />
                <div className="flex-1 space-y-4">
                  <div className="flex gap-2">
                    <div className="w-20 h-3 skeleton rounded-full" />
                    <div className="w-20 h-3 skeleton rounded-full" />
                  </div>
                  <div className="w-full h-8 skeleton" />
                  <div className="w-3/4 h-8 skeleton" />
                  <div className="w-full h-4 skeleton mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
