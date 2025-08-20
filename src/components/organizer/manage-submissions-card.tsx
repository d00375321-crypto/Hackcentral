import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProjects } from "@/lib/firebase/firestore"
import { FileSearch } from "lucide-react"
import Link from "next/link"

export async function ManageSubmissionsCard() {
  const projects = await getProjects();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Submissions</CardTitle>
        <CardDescription>Review and check projects for plagiarism.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell className="text-right">
                    <Link href="/plagiarism-checker" passHref>
                        <Button variant="outline" size="sm">
                            <FileSearch className="mr-2 h-4 w-4" />
                            Check
                        </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
