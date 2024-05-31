import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import { SearchResults } from "@/components/SearchResults";
import { availableDietItems } from "@/components/SearchForm/searchFormFilterItems.ts";
import { useSearchParams } from "react-router-dom";
import { MAX_SEARCH_QUERY_LEN } from "@/helpers/constants.ts";
import { SearchFormFilter } from "@/components/SearchForm/SearchFormFilter.tsx";
import { TUserRecipeSearchParams } from "@/types/TUserRecipeSearchParams.ts";

// Zod schema object, used to define a form schema for validation
const formSchema = z.object({
  q: z
    .string()
    .trim()
    .max(MAX_SEARCH_QUERY_LEN, {
      message: `Enter no more than ${MAX_SEARCH_QUERY_LEN} characters.`,
    })
    .optional(),
  diet: z.array(z.string()),
});

export function UserSearchForm() {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [URLSearchParams, setURLSearchParams] = useSearchParams();
  const [searchParams, setSearchParams] = useState<TUserRecipeSearchParams>();

  // Code executed after submitting a form
  function handleSubmit(values: z.infer<typeof formSchema>) {
    setURLSearchParams(values);
    setIsSubmitted(true);
    setSearchParams(values);
  }

  // Form definition using a Zod schema for validation. "z.infer" infers a TypeScript type from a Zod schema.
  const form = useForm<z.infer<typeof formSchema>>({
    // Use forSchema to validate form data
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: "",
      diet: [],
    },
  });

  // Submit form when URL search params changed
  useEffect(() => {
    // if(URLSearchParams.size > 0) {
    setIsSubmitted(true);

    const values: TUserRecipeSearchParams = {
      q: URLSearchParams.get("q") ?? "", //assign an empty string if equals null
      diet: URLSearchParams.getAll("diet") ?? [],
    };

    // set values in input and filters
    form.setValue("q", values.q);
    form.setValue("diet", values.diet);

    setSearchParams(values);
    // }
  }, [URLSearchParams]);

  return (
    <>
      {/* Main form form searching recipes */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={"flex flex-col"}>
          <div className={"flex gap-x-2"}>
            {/* Main search field */}
            <FormField
              name={"q"}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className={"w-64"} placeholder={"Dish name..."} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type={"submit"}>Search</Button>
          </div>
          <div className={"mt-3 flex gap-x-3 flex-wrap gap-y-3"}>
            {/* Diet filter */}
            <SearchFormFilter
              title={"Diet"}
              fieldName={"diet"}
              items={availableDietItems}
              form={form}
            />
          </div>
        </form>
      </Form>
      {/* If form submitted and query is not empty show search results */}
      {isSubmitted && searchParams && (
        <div className={"mt-7"}>
          <SearchResults searchParams={searchParams} dataSource={"user"} />
        </div>
      )}
    </>
  );
}
