import {Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {createSearchParams, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MAX_SEARCH_QUERY_LEN} from "@/helpers/constants.ts";

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  q: z
      .string()
      .trim()
      .min(1, {message: "Enter a search term"})
      .max(MAX_SEARCH_QUERY_LEN, {message: `Enter no more than ${MAX_SEARCH_QUERY_LEN} characters.`}),
})

type HomeSearchBarProps = {
  className?: string
}

export function HomeSearchBar({className}: HomeSearchBarProps) {
  const navigate = useNavigate();

  function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    // Redirect to /search subpage with the entered text as a parameter
    navigate({
      pathname: '/search',
      search: createSearchParams(values).toString()
    });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: ""
    }
  })

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
          <div className={'flex gap-x-2'}>
            {/* Search field */}
            <FormField
                control={form.control}
                name={'q'}
                render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input className={'w-72 pt-6 pr-6 pb-6 pl-4'} placeholder={"Search for your favourite dishes..."} {...field}/>
                      </FormControl>
                    </FormItem>
                )}
            />
            {/* Submit button*/}
            <Button type={'submit'} className={'p-6'}>Search</Button>
          </div>
        </form>
      </Form>
  )
}