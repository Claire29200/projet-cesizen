
import { useDiagnosticStore } from "@/store/diagnostic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ResultsTab() {
  const { getAllResults } = useDiagnosticStore();
  const allResults = getAllResults();

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-mental-800">
          Résultats des diagnostics
        </h2>
        <span className="text-sm text-mental-500">
          {allResults.length} résultats au total
        </span>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allResults.length > 0 ? (
              allResults
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      #{result.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      {result.userId ? result.userId : "Anonyme"}
                    </TableCell>
                    <TableCell>{result.totalScore}</TableCell>
                    <TableCell>{result.feedbackProvided}</TableCell>
                    <TableCell>
                      {new Date(result.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Aucun résultat trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
