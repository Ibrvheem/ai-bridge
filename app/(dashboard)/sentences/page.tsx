"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  Loader2,
} from "lucide-react";
import dayjs from "@/lib/dayjs";
import { getAllSentences } from "../annotations/services";

interface SentenceListItem {
  _id: string;
  text: string;
  language: string;
  country: string;
  source_type: string;
  domain: string;
  theme: string;
  bias_label: string | null;
  target_gender: string | null;
  exported_at: string | null;
  created_at: string;
  collector_id?: { email: string };
  annotator_id?: { email: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function SentencesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [sentences, setSentences] = useState<SentenceListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>(
    searchParams.get("filter") || "all",
  );

  const fetchSentences = useCallback(
    async (page: number, filterVal: string) => {
      setIsLoading(true);
      startTransition(async () => {
        try {
          const filterParam = filterVal === "all" ? undefined : filterVal;
          const response = await getAllSentences(page, 20, filterParam);
          setSentences(response.data || []);
          setPagination(
            response.pagination || {
              page: 1,
              limit: 20,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          );
        } catch (error) {
          console.error("Error fetching sentences:", error);
          setSentences([]);
        } finally {
          setIsLoading(false);
        }
      });
    },
    [],
  );

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const filterParam = searchParams.get("filter") || "all";
    setFilter(filterParam);
    fetchSentences(page, filterParam);
  }, [searchParams, fetchSentences]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/sentences?${params.toString()}`);
  };

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (value !== "all") {
      params.set("filter", value);
    }
    router.push(`/sentences?${params.toString()}`);
  };

  const getBiasLabelBadge = (label: string | null) => {
    if (!label) return <Badge variant="outline">Pending</Badge>;

    const colorMap: Record<string, string> = {
      biased: "bg-red-100 text-red-800 hover:bg-red-100",
      neutral: "bg-green-100 text-green-800 hover:bg-green-100",
      counter_speech: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    };

    return (
      <Badge className={colorMap[label] || "bg-slate-100 text-slate-800"}>
        {label.replace(/_/g, " ")}
      </Badge>
    );
  };

  const getExportBadge = (exportedAt: string | null) => {
    if (!exportedAt) return null;
    return (
      <Badge
        variant="outline"
        className="text-xs border-emerald-200 text-emerald-700"
      >
        Exported
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            All Sentences
          </h1>
          <p className="text-slate-600">
            Browse and manage all sentences in the database
          </p>
        </div>
      </div>

      {/* Filters and Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentences</SelectItem>
                <SelectItem value="annotated">Annotated</SelectItem>
                <SelectItem value="unannotated">Unannotated</SelectItem>
                <SelectItem value="exported">Exported</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          {pagination.total.toLocaleString()} sentence
          {pagination.total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Sentences</CardTitle>
          <CardDescription>
            Page {pagination.page} of {pagination.totalPages || 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : sentences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">No sentences found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700 w-[40%]">Text</TableHead>
                  <TableHead className="text-slate-700">Language</TableHead>
                  <TableHead className="text-slate-700">Domain</TableHead>
                  <TableHead className="text-slate-700">Status</TableHead>
                  <TableHead className="text-slate-700">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentences.map((sentence) => (
                  <TableRow key={sentence._id} className="border-slate-200">
                    <TableCell>
                      <p
                        className="text-sm text-slate-900 max-w-md truncate"
                        title={sentence.text}
                      >
                        {sentence.text.length > 80
                          ? `${sentence.text.slice(0, 80)}...`
                          : sentence.text}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-700 capitalize">
                        {sentence.language}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600 capitalize">
                        {sentence.domain?.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getBiasLabelBadge(sentence.bias_label)}
                        {getExportBadge(sentence.exported_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">
                        {dayjs(sentence.created_at).format("MMM D, YYYY")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
