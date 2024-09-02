import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Checkbox,
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup, RadioGroupItem,
  Switch,
  Input,
  toast
} from "@/components/ui"

const notificationsFormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

export default function Gear() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  function onSubmit(data: NotificationsFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <div className="flex flex-col w-full h-full p-2 space-y-6">
      <h3 className="ml-3 text-lg font-medium">设置 | Settings</h3>
      <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 h-full overflow-y-auto p-6">
        <div>
          <div className="space-y-4">
          <h5 className="mb-4 text-lg font-medium">模型设置</h5>
          <FormField
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      API请求域名
                    </FormLabel>
                    <FormDescription>
                    API 服务请求的域名，https:// http:// 协议开头
                    </FormDescription>
                  </div>
                  <div className="space-y-0.5 w-[260px]">
                  <FormControl>
                    <Input type="text"/>
                  </FormControl>
                  </div>
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      API请求路径
                    </FormLabel>
                    <FormDescription>
                      API 服务请求的 path
                    </FormDescription>
                  </div>
                  <div className="space-y-0.5 w-[260px]">
                  <FormControl>
                    <Input type="text"/>
                  </FormControl>
                  </div>
                </FormItem>
              )}
            />


<FormField
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      API Key
                    </FormLabel>
                    <FormDescription>
                    API 请求授权 Key
                    </FormDescription>
                  </div>
                  <div className="space-y-0.5 w-[260px]">
                  <FormControl>
                    <Input type="text"/>
                  </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communication_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      显示对话时间
                    </FormLabel>
                    <FormDescription>
                      在聊天气泡框边上显示对话时间
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      上下文记忆
                    </FormLabel>
                    <FormDescription>
                      对话时将把当前会话的前后上下文问题记住，用于开启多轮对话（会消耗大量Token）
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Token 用量</FormLabel>
                    <FormDescription>
                      展示当前问题的Token预计消耗情况
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Security emails</FormLabel>
                    <FormDescription>
                      Receive emails about your account activity and security.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Use different settings for my mobile devices
                </FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the{" "}
               
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
        <Button className="mr-2" type="reset" variant="outline">取消</Button>
        <Button className="ml-2" type="submit">保存</Button>
        </div>
     
      </form>
    </Form>
    </div>

    
  )
}