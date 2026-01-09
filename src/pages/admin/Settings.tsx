import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
        <p className="text-muted-foreground mt-1">إعدادات لوحة التحكم</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات عامة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            سيتم إضافة المزيد من الإعدادات قريباً
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
