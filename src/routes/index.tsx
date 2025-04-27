import {
  AppShell,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  TypographyStylesProvider,
} from '@mantine/core'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { DEPLOY_URL } from '~/utils/config'

export const Route = createFileRoute('/')({
  component: Home,
})

interface ChatEntry {
  question: string
  created: number
  answer: string
}

interface ApiResponse {
  created: number
  content: string
}

function Home() {
  const [inputValue, setInputValue] = useState('')

  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const currentQuestion = inputValue
    if (!currentQuestion.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(DEPLOY_URL + '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: currentQuestion }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      const newEntry: ChatEntry = {
        question: currentQuestion,
        created: data.created,
        answer: data.content,
      }

      setChatHistory((prevHistory) => [...prevHistory, newEntry])
    } catch (e) {
      if (e instanceof Error) {
        setError(`Błąd podczas wysyłania zapytania: ${e.message}`)
      } else {
        setError('Wystąpił nieznany błąd')
      }
      console.error('Błąd:', e)
    } finally {
      setIsLoading(false)
      setInputValue('')
    }
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>LOGO</AppShell.Header>
      <AppShell.Main>
        <Stack align="stretch" mt="xl" style={{ width: '100%' }}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Group preventGrowOverflow={false} wrap="nowrap">
              <TextInput
                placeholder="Wpisz coś..."
                value={inputValue}
                onChange={(event) => setInputValue(event.currentTarget.value)}
                required
                disabled={isLoading}
                autoComplete="off"
                style={{ flexGrow: 1 }}
              />
              <Button type="submit" loading={isLoading}>
                Zapytaj
              </Button>
            </Group>
          </form>

          {error && (
            <Text color="red" mt="md" ta="center">
              {error}
            </Text>
          )}

          <Stack mt="lg" gap="lg">
            {chatHistory
              .slice()
              .reverse()
              .map((entry, index) => (
                <Paper
                  key={chatHistory.length - 1 - index}
                  shadow="xs"
                  p="md"
                  withBorder
                >
                  <Text fw={500} mb="xs">
                    {entry.question} ~{' '}
                    {new Date(entry.created * 1000).toLocaleString()}
                  </Text>
                  <Divider my="xs" />
                  <TypographyStylesProvider>
                    <ReactMarkdown>{entry.answer}</ReactMarkdown>
                  </TypographyStylesProvider>
                </Paper>
              ))}
          </Stack>
        </Stack>
      </AppShell.Main>
    </AppShell>
  )
}
