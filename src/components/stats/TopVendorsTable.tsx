import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Currency } from "@/lib/money/money.schema";
import { formatMoney } from "@/lib/money/money.format";
import type { VendorTotal } from "@/lib/stats/stats.schema";

export function TopVendorsTable({
  vendors,
  currency,
}: {
  vendors: VendorTotal[];
  currency: Currency;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top vendors by spend</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-105">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Total spend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor, index) => (
                <TableRow key={vendor.vendor}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{vendor.vendor}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatMoney(vendor.total, currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
