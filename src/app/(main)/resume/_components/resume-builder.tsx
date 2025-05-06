/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { saveResume } from "@/actions/resume";
import EntryForm from "@/app/(main)/resume/_components/form-entry";
import { resumeSchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { se } from "date-fns/locale";
import { Download, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
interface ResumeBuilderProps {
  initialContent?: string;
}
const ResumeBuilder = ({ initialContent }: ResumeBuilderProps) => {
  const [activeTab, setActiveTab] = useState("edit");
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: { email: "", mobile: "", linkedinUrl: "", twitter: "" },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) {
      setActiveTab("preview");
    }
  }, [initialContent]);

  const onSubmit = async (data: unknown) => {};

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button variant={"destructive"}>
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <h3 className="text-lg font-medium"> Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg bg-muted/50 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@mail.com"
                    //   onError={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                    //   onError={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Linkedin Url</label>
                  <Input
                    {...register("contactInfo.linkedinUrl")}
                    type="url"
                    placeholder="https://www.linkedin.com/in/your-profile"
                    //   onError={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.linkedinUrl && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedinUrl.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter / X profile
                  </label>
                  <Input
                    {...register("contactInfo.linkedinUrl")}
                    type="url"
                    placeholder="https://www.twitter.com/your-profile"
                    //   onError={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Professional summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="write a compelling professional summary..."
                    // error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your skills here..."
                    // error={errors.summary}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Work experience</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"Experience"}
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"education"}
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type={"projects"}
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
