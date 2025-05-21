import Link from "next/link";
import type { API } from "@/domain/api/entity";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Tag, Info, ArrowRight } from "lucide-react";

type ApiCardProps = {
  api: API;
};

export default function ApiCard({ api }: ApiCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-primary">{api.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Team: {api.team}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {api.description ? (
          <p className="text-sm text-foreground line-clamp-3 mb-2">
            {api.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic mb-2">
            No description available.
          </p>
        )}
        <div className="text-xs text-muted-foreground space-y-1">
          {api.createdAt && (
            <p>Created: {new Date(api.createdAt).toLocaleDateString()}</p>
          )}
          {api.updatedAt && (
            <p>Updated: {new Date(api.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/apis/${api.id}`} legacyBehavior passHref>
          <Button variant="outline" className="w-full group">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
