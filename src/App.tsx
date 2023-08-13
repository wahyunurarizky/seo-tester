import { useEffect, useState } from 'react'
import 'tiny-ui/dist/styles/index.css'
import 'react-quill/dist/quill.snow.css'
import './App.css'

import SEOContentAnalyzer from 'seo-content-analyzer/dist/client'
import { Input } from 'tiny-ui'
import ReactQuill from 'react-quill'
import {
  SEOResponse,
  SectionMessage,
  SectionScore
} from 'seo-content-analyzer/dist/types'
// import SEOContentAnalyzer, { SEOResponse } from 'seo-content-analyzer'

interface Form {
  title: string
  keyword: string
  metaDescription: string
  content: string
}

function App() {
  const [form, setForm] = useState<Form>({
    content: '',
    keyword: '',
    metaDescription: '',
    title: ''
  })

  const [result, setResult] = useState<SEOResponse>({
    sectionScore: [],
    seoScore: 0
  })

  useEffect(() => {
    try {
      const calc = SEOContentAnalyzer({
        content: form.content,
        descriptionMeta: form.metaDescription,
        keyword: form.keyword,
        title: form.title
      })
      setResult(calc)
    } catch (error) {
      console.log(error)
    }
  }, [form])

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: 10,
          flexDirection: 'column'
        }}
      >
        <Input
          placeholder="Keyword"
          crossOrigin={undefined}
          value={form.keyword}
          onChange={(e) => {
            setForm((p) => ({ ...p, keyword: e.target.value }))
          }}
        />
        <Input
          placeholder="Title"
          crossOrigin={undefined}
          value={form.title}
          onChange={(e) => {
            setForm((p) => ({ ...p, title: e.target.value }))
          }}
        />
        <Input
          placeholder="Meta Description"
          crossOrigin={undefined}
          value={form.metaDescription}
          onChange={(e) => {
            setForm((p) => ({ ...p, metaDescription: e.target.value }))
          }}
        />
        <ReactQuill
          modules={{
            toolbar: {
              container: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean'],
                [{ color: [] }]
              ]
            }
          }}
          value={form.content}
          onChange={(v) => {
            console.log(v)

            setForm((p) => ({ ...p, content: v }))
          }}
        />
        <h4>SEO SCORE: {result.seoScore}</h4>
        {result.sectionScore.map((d: SectionScore) => (
          <div>
            <h6>
              {d.name} : {d.score}
            </h6>
            <ul>
              {d.messages.map((dd: SectionMessage) => {
                const background =
                  dd.status === 'bad'
                    ? 'red'
                    : dd.status === 'good'
                    ? 'orange'
                    : 'green'
                return (
                  <li
                    style={{ background, marginBottom: 5, textAlign: 'left' }}
                  >
                    {dd.text} : {dd.score}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
