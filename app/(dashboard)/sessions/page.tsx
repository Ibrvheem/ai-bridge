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
import {
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Download,
  Plus,
  Clock,
  FileText,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getSessions, getUserSessionStats } from "./services";
import { SessionStatus } from "./types";
import dayjs from "@/lib/dayjs";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateSessionModal } from "./_components";

function getStatusBadge(status: SessionStatus) {
  switch (status) {
    case SessionStatus.ACTIVE:
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 border">
          <PlayCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case SessionStatus.PAUSED:
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 border">
          <PauseCircle className="h-3 w-3 mr-1" />
          Paused
        </Badge>
      );
    case SessionStatus.COMPLETED:
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 border">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case SessionStatus.EXPORTED:
      return (
        <Badge className="bg-purple-50 text-purple-700 border-purple-200 border">
          <Download className="h-3 w-3 mr-1" />
          Exported
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function SessionsPage() {
  const sessions = await getSessions();
  const stats = await getUserSessionStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Annotation Sessions
          </h1>
          <p className="text-slate-600">
            Create and manage annotation sessions for exporting to ML team
          </p>
        </div>
        <CreateSessionModal>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        </CreateSessionModal>
      </div>

      {/* Statistics Cards */}
      <div className="gap-4 md:grid-cols-4 grid">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Sessions
            </CardTitle>
            <Layers className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.total_sessions ?? 0}
            </div>
            <p className="text-xs text-slate-500">All-time sessions</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Active Sessions
            </CardTitle>
            <PlayCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.active_sessions ?? 0}
            </div>
            <p className="text-xs text-slate-500">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Total Annotated
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.total_annotated ?? 0}
            </div>
            <p className="text-xs text-slate-500">Sentences annotated</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">
              Unique Exports
            </CardTitle>
            <Download className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats?.unique_exported_sentences ?? 0}
            </div>
            <p className="text-xs text-slate-500">No duplicates in exports</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Your Sessions</CardTitle>
          <CardDescription>
            Continue an existing session or create a new one to start annotating
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions && sessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Annotated</TableHead>
                  <TableHead className="text-center">Exported</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-center">Exports</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {session.name}
                        </span>
                        {session.description && (
                          <span className="text-xs text-slate-500">
                            {session.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(session.status)}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">
                        {session.total_annotated}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          session.total_exported > 0
                            ? "text-green-600 font-medium"
                            : "text-slate-400"
                        }
                      >
                        {session.total_exported}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Clock className="h-3.5 w-3.5" />
                        {dayjs(session.last_activity_at).fromNow()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {session.exports?.length ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/sessions/${session._id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          {session.status === SessionStatus.ACTIVE
                            ? "Continue"
                            : "View"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={PlayCircle}
              title="No annotation sessions yet"
              description="Create your first session to start annotating sentences and exporting them to your ML team."
            >
              <CreateSessionModal>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Session
                </Button>
              </CreateSessionModal>
            </EmptyState>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
