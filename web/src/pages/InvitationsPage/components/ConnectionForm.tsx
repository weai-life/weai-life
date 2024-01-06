import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from 'weai-ui'
import * as z from 'zod'

import { useMutation } from '@redwoodjs/web'

const formSchema = z.object({
  email: z.string().email(),
})

const CREATE_CONNECTION = gql`
  mutation CreateConnectionMutation($email: String!) {
    createConnectionByEmail(email: $email) {
      id
      status
    }
  }
`
import { QUERY as SentConnectionsQuery } from 'src/components/SentConnectionsCell'

export default function ConnectionForm({ onSaved }: { onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [create] = useMutation(CREATE_CONNECTION, {
    refetchQueries: [{ query: SentConnectionsQuery }],
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (saving) return
    setSaving(true)
    const { email } = values
    await create({
      variables: {
        email,
      },
    })
    setSaving(false)
    form.reset()
    onSaved()
  }

  return (
    <div className="mt-4 container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email you want to connect"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Will send invite link to above email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Invite'
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
