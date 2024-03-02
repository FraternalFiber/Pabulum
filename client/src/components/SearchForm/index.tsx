import { z } from "zod";
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  searchTerm: z
      .string()
      .min(2, {message: "Enter at least 2 characters"})
      .max(50, {message: "Enter no more than 50 characters."})
})

export default function SearchForm() {
  // Form definition using a Zod schema for validation. "z.infer" infers a TypeScript type from a Zod schema.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: ""
    }
  })

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    fetch('http://127.0.0.1:42069/search')
        .then(res => res.json())
        .then((res) => {
          console.log(res.results);
        })
        .catch((error) => {
          console.error('Backend API connection error: ', error);
        })
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col'}>
          <div className={'flex gap-x-2'}>
            <FormField
              control={form.control}
              name={'searchTerm'}
              render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input className={'w-64'} placeholder={"Dish name..."} {...field}/>
                    </FormControl>
                  </FormItem>
              )}
            />
            <Button type={'submit'}>Search</Button>
          </div>
        </form>
      </Form>
  );
}