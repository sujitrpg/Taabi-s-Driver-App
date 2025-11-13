import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Share2, Users, Trophy, PlusCircle, Camera } from "lucide-react";
import { useCommunityPosts, useCreatePost, useLikePost } from "@/lib/hooks/useCommunity";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import prakharImage from "@/assets/images/prakhar.jpeg";
import shubhamImage from "@/assets/images/shubham.jpeg";

const CURRENT_DRIVER_ID = "default-driver-1";

const driverAvatars: Record<string, string> = {
  "driver-3": shubhamImage,
  "driver-2": prakharImage,
  "default-driver-1": prakharImage
};

export default function Community() {
  const [newPost, setNewPost] = useState("");
  const [postCategory, setPostCategory] = useState<string>("story");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: posts, isLoading } = useCommunityPosts();
  const createPostMutation = useCreatePost();
  const likePostMutation = useLikePost();
  const { toast } = useToast();

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    try {
      await createPostMutation.mutateAsync({
        driverId: CURRENT_DRIVER_ID,
        content: newPost,
        category: postCategory,
        images: [],
      });
      
      setNewPost("");
      setDialogOpen(false);
      toast({
        title: "Post Created!",
        description: "Your post has been shared with the community",
      });
    } catch (error: any) {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePostMutation.mutateAsync(postId);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const topContributors = [
    { name: "Suresh Reddy", contributions: 45, badge: "🏆" },
    { name: "Manoj Gupta", contributions: 38, badge: "🥈" },
    { name: "Deepak Yadav", contributions: 32, badge: "🥉" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[30vh] bg-gradient-to-br from-purple-500/20 to-taabi-blue/20 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">Share, learn, and connect</p>
          <p className="text-xs text-muted-foreground/60 mt-2">Community powered by taabi.ai</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Card className="p-4 hover-elevate cursor-pointer" data-testid="button-create-post">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={prakharImage} alt="Prakhar" />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-muted-foreground">
                  Share your story or tips...
                </div>
                <PlusCircle className="w-6 h-6 text-taabi-blue" />
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent data-testid="dialog-create-post">
            <DialogHeader>
              <DialogTitle>Create Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[120px]"
                data-testid="textarea-new-post"
              />
              <div className="flex gap-2 flex-wrap">
                {["story", "tip", "photo", "question"].map((cat) => (
                  <Button
                    key={cat}
                    variant={postCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPostCategory(cat)}
                    className="capitalize"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <Button 
                className="w-full bg-taabi-blue hover:bg-taabi-blue/90" 
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending || !newPost.trim()}
                data-testid="button-publish-post"
              >
                {createPostMutation.isPending ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div>
              <h3 className="font-bold">Recognition Zone</h3>
              <p className="text-sm text-muted-foreground">Top contributors this month</p>
            </div>
          </div>
          <div className="space-y-2">
            {topContributors.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{contributor.badge}</span>
                  <span className="font-semibold">{contributor.name}</span>
                </div>
                <Badge variant="secondary">{contributor.contributions} posts</Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </>
          ) : (
            posts?.map((post) => {
              const avatarUrl = driverAvatars[post.driverId] || post.driver.avatarUrl || undefined;
              return (
              <Card key={post.id} className="p-6" data-testid={`card-post-${post.id}`}>
                <div className="flex gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{post.driver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold" data-testid={`text-author-${post.id}`}>
                          {post.driver.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {post.driver.level} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="mb-4 leading-relaxed" data-testid={`text-content-${post.id}`}>{post.content}</p>
                
                <div className="flex items-center gap-6 pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleLike(post.id)}
                    disabled={likePostMutation.isPending}
                    data-testid={`button-like-${post.id}`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2" data-testid={`button-comment-${post.id}`}>
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2" data-testid={`button-share-${post.id}`}>
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </Card>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}
