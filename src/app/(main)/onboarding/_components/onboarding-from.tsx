"use client";

import { updateUser } from "@/actions/user";
import { onboardingSchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { industries } from "@/data/industries";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
type IndustryType = (typeof industries)[number];
interface OnboardingProps {
  industries: IndustryType[];
}
const OnboardingFrom = ({ industries }: OnboardingProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<
    IndustryType | null | undefined
  >(null);
  const router = useRouter();

  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ resolver: zodResolver(onboardingSchema) });

  const onSubmit = async (values: FieldValues) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;
      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (updateResult && !updateLoading) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading, router]);

  const watchIndustry = watch("industry");
  return (
    <div className="flex justify-center items-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete your profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => {
                    return (
                      <SelectItem
                        value={ind.id}
                        key={ind.id}
                      >
                        {ind.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-400">
                  {String(errors.industry.message)}
                </p>
              )}
            </div>
            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("subIndustry", value);
                  }}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select an Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.subIndustries.map((ind) => {
                      return (
                        <SelectItem
                          value={ind}
                          key={ind}
                        >
                          {ind}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-400">
                    {String(errors.subIndustry.message)}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="experience">Years of experience</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                max={50}
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-400">
                  {String(errors.experience.message)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., python, Javascript, Project management"
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills using commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-400">
                  {String(errors.skills.message)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Professional bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background"
                className="h-32"
                {...register("bio")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple bio using commas
              </p>
              {errors.bio && (
                <p className="text-sm text-red-400">
                  {String(errors.bio.message)}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                </>
              ) : (
                "Complete profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFrom;
