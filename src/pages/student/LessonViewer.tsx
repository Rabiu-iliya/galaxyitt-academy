import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  module_id: string;
}

const LessonViewer = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("lessons")
        .select("id, title, content, video_url, module_id")
        .eq("id", lessonId)
        .single();
      setLesson(data);
      setLoading(false);
    };
    fetch();
  }, [lessonId]);

  if (loading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>;
  }

  if (!lesson) {
    return <div className="p-8 text-center text-muted-foreground">Lesson not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to={`/student/modules/${lesson.module_id}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
      </div>

      {lesson.video_url && (
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-lg">
            <video
              controls
              className="w-full aspect-video bg-black"
              src={lesson.video_url}
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </CardContent>
        </Card>
      )}

      {lesson.content && (
        <Card>
          <CardContent className="p-6 prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">{lesson.content}</div>
          </CardContent>
        </Card>
      )}

      {!lesson.video_url && !lesson.content && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No content available for this lesson yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LessonViewer;
