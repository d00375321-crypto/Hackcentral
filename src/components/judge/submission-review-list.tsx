import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { getProjects, getProjectTeam } from "@/lib/firebase/firestore"
import { format } from "date-fns"
import { ExternalLink } from "lucide-react"

async function TeamName({ projectId }: { projectId: string }) {
    const team = await getProjectTeam(projectId);
    return <>{team?.name || 'N/A'}</>;
}


export async function SubmissionReviewList() {
  const projects = await getProjects();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Submissions</CardTitle>
        <CardDescription>
          Review the submitted projects and provide your scores and feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                    <TeamName projectId={project.id} />
                </TableCell>
                <TableCell>{format(new Date(project.submittedAt), 'PPp')}</TableCell>
                <TableCell className="text-right">
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Review</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Review: {project.name}</DialogTitle>
                        <DialogDescription>
                          Evaluate the project based on the criteria below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                         <div className="flex gap-4">
                          <Button asChild variant="secondary" size="sm">
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> GitHub
                            </a>
                          </Button>
                           <Button asChild variant="secondary" size="sm">
                            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> Video
                            </a>
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="innovation" className="text-right">Innovation</Label>
                          <Input id="innovation" type="number" max={10} min={0} className="col-span-3" placeholder="Score (0-10)"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="impact" className="text-right">Impact</Label>
                          <Input id="impact" type="number" max={10} min={0} className="col-span-3" placeholder="Score (0-10)"/>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="feasibility" className="text-right">Feasibility</Label>
                          <Input id="feasibility" type="number" max={10} min={0} className="col-span-3" placeholder="Score (0-10)"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="presentation" className="text-right">Presentation</Label>
                          <Input id="presentation" type="number" max={10} min={0} className="col-span-3" placeholder="Score (0-10)"/>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <Label htmlFor="feedback" className="text-right mt-2">Feedback</Label>
                           <Textarea id="feedback" className="col-span-3" placeholder="Provide constructive feedback..." />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Submit Review</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
