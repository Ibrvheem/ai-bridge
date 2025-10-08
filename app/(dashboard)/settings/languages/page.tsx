import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { Languages, Globe, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { getLanguages } from "./service";
import { Language } from "./types";
import { LanguageFormModal } from "./_components/language-form-modal";
import { LanguageDeleteModal } from "./_components/language-delete-modal";
import { LanguagesEmptyState } from "./_components/languages-empty-state";

export default async function LanguagesPage() {
  const languages: Language[] = await getLanguages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/settings"
              className="text-muted-foreground hover:text-foreground"
            >
              Settings
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Languages</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Language Management
          </h1>
          <p className="text-muted-foreground">
            Add and manage supported languages for annotation
          </p>
        </div>

        <LanguageFormModal />
      </div>
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Languages
            </CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{languages.length}</div>
            <p className="text-xs text-muted-foreground">
              Languages configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Languages
            </CardTitle>
            <Globe className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {languages.filter((lang) => lang.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for selection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sentences
            </CardTitle>
            <Badge variant="secondary">0</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Across all languages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used</CardTitle>
            <Languages className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Highest sentence count
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Languages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Languages List</CardTitle>
          <CardDescription>Manage all configured languages</CardDescription>
        </CardHeader>
        <CardContent>
          {languages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Language</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Native Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sentences</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {languages.map((language) => (
                  <TableRow key={language._id}>
                    <TableCell className="font-medium">
                      {language.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{language.code}</Badge>
                    </TableCell>
                    <TableCell>{language.native_name}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Badge
                          variant={language.isActive ? "default" : "secondary"}
                          className="cursor-pointer"
                        >
                          {language.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">0</Badge>
                    </TableCell>
                    <TableCell>
                      {dayjs(language.created_at).format("MMM D, YYYY")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <LanguageDeleteModal language={language}>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </LanguageDeleteModal>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <LanguagesEmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
