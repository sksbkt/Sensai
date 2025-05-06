/* eslint-disable @typescript-eslint/no-unused-vars */
'use client";';
import { improveWithAi } from "@/actions/resume";
import { entrySchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { formateDisplayDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Sparkles, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface EntryFormProps {
  type: string;
  entries: z.infer<typeof entrySchema>[];
  onChange: (data: unknown) => void;
}

const EntryForm = ({ type, entries, onChange }: EntryFormProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAi);

  useEffect(() => {
    if (improvedContent && !isImproving && !improveError) {
      setValue("description", improvedContent);
    }
    if (improveError) {
      toast.error(
        improveError || "Error improving description. Please try again."
      );
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleAdd = handleValidation((data) => {
    console.log("HERE");

    const formateEntry = {
      ...data,
      startDate: formateDisplayDate(data.startDate),
      endDate: data.current ? "" : formateDisplayDate(data.endDate),
    };
    onChange([...entries, formateEntry]);
    reset();
    setIsAdding(false);
  });
  const handleDelete = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description to improve.");
      return;
    }
    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries &&
          entries.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>
                  {item.title} @ {item.organization}
                </CardTitle>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => handleDelete(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.current
                    ? `${item.startDate} - Present`
                    : `${item.startDate} - ${item.endDate}`}
                </p>
                <p className="mt-2 text-sm  whitespace-pre-wrap">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Title/Position"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Organization/Company"
                  {...register("organization")}
                />
                {errors.organization && (
                  <p className="text-red-500 text-sm">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  type="month"
                  placeholder="Start date"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  placeholder="End date"
                  {...register("endDate")}
                  disabled={current}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                {...register("current")}
                onCheckedChange={(checked: boolean) => {
                  setValue("current", checked);
                  if (checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label
                htmlFor="current"
                className="text-sm font-medium"
              >
                Current {type}
              </label>
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant={"ghost"}
              size={"sm"}
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Improving
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improving with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-row gap-4 justify-end">
            <Button
              variant={"outline"}
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}
      {!isAdding && (
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      )}
    </div>
  );
};

export default EntryForm;
