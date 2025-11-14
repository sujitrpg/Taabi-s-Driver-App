import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck, CircleCheck, AlertCircle, Trophy, Lightbulb } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { ChecklistTemplate, ChecklistCompletion } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_DRIVER_ID = "default-driver-1";

export default function TruckChecklist() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"pre_trip" | "post_trip">("pre_trip");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");

  const { data: templates, isLoading: templatesLoading } = useQuery<ChecklistTemplate[]>({
    queryKey: ["/api/checklist-templates"],
  });

  const { data: completions, isLoading: completionsLoading } = useQuery<ChecklistCompletion[]>({
    queryKey: ["/api/checklist-completions/driver", DEFAULT_DRIVER_ID],
  });

  const completeChecklistMutation = useMutation({
    mutationFn: async () => {
      const currentTemplate = templates?.find((t) => t.checklistType === activeTab);
      if (!currentTemplate) throw new Error("Template not found");

      const res = await apiRequest("POST", "/api/checklist-completions", {
        driverId: DEFAULT_DRIVER_ID,
        checklistType: activeTab,
        completedItems: Array.from(checkedItems),
        allItemsCompleted: checkedItems.size === currentTemplate.items.length,
        notes: notes || null,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/checklist-completions/driver", DEFAULT_DRIVER_ID] });
      queryClient.invalidateQueries({ queryKey: ["/api/driver"] });
      setCheckedItems(new Set());
      setNotes("");
      toast({
        title: "Checklist Submitted!",
        description: checkedItems.size === templates?.find((t) => t.checklistType === activeTab)?.items.length
          ? "Great job! You completed all items and earned bonus points!"
          : "Checklist saved successfully.",
      });
    },
  });

  const currentTemplate = templates?.find((t) => t.checklistType === activeTab);
  const recentCompletions = completions?.filter((c) => c.checklistType === activeTab).slice(0, 3) || [];

  const handleToggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  const completionRate = currentTemplate 
    ? Math.round((checkedItems.size / currentTemplate.items.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[35vh] bg-gradient-to-br from-taabi-blue/20 to-emerald-500/20 flex items-center justify-center">
        <div className="text-center p-4">
          <ClipboardCheck className="w-16 h-16 text-taabi-blue mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Truck Checklist</h1>
          <p className="text-muted-foreground">Pre-trip & post-trip inspections</p>
          <p className="text-xs text-muted-foreground/60 mt-2">Complete checklists earn bonus points</p>
        </div>
      </div>

      <div className="p-4 -mt-8 space-y-6">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "pre_trip" ? "default" : "outline"}
            className="flex-1"
            onClick={() => {
              setActiveTab("pre_trip");
              setCheckedItems(new Set());
            }}
            data-testid="button-tab-pre-trip"
          >
            Pre-Trip
          </Button>
          <Button
            variant={activeTab === "post_trip" ? "default" : "outline"}
            className="flex-1"
            onClick={() => {
              setActiveTab("post_trip");
              setCheckedItems(new Set());
            }}
            data-testid="button-tab-post-trip"
          >
            Post-Trip
          </Button>
        </div>

        {templatesLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : currentTemplate ? (
          <>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{currentTemplate.name}</h3>
                <Badge variant={completionRate === 100 ? "default" : "secondary"} className={completionRate === 100 ? "bg-lime-green text-white" : ""}>
                  {completionRate}% Complete
                </Badge>
              </div>

              <div className="space-y-3">
                {currentTemplate.items.map((item) => {
                  const isChecked = checkedItems.has(item);
                  return (
                    <div
                      key={item}
                      className="flex items-start gap-3 p-3 rounded-lg hover-elevate cursor-pointer"
                      onClick={() => handleToggleItem(item)}
                      data-testid={`checkbox-item-${item}`}
                    >
                      <Checkbox
                        checked={isChecked}
                        className="mt-0.5"
                      />
                      <span className={`flex-1 ${isChecked ? "line-through text-muted-foreground" : ""}`}>
                        {item}
                      </span>
                      {isChecked && <CircleCheck className="w-5 h-5 text-lime-green flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">Additional Notes (Optional)</label>
                <Textarea
                  placeholder="Any observations or issues to report?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none"
                  rows={3}
                  data-testid="textarea-notes"
                />
              </div>

              <Button
                className="w-full mt-4"
                disabled={checkedItems.size === 0 || completeChecklistMutation.isPending}
                onClick={() => completeChecklistMutation.mutate()}
                data-testid="button-submit-checklist"
              >
                {completeChecklistMutation.isPending ? "Submitting..." : "Submit Checklist"}
              </Button>

              {checkedItems.size === currentTemplate.items.length && (
                <div className="mt-4 p-4 bg-lime-green/10 border border-lime-green/30 rounded-lg flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-lime-green flex-shrink-0" />
                  <p className="text-sm font-medium text-lime-green">
                    Perfect! Submit now to earn +20 bonus Taabi points!
                  </p>
                </div>
              )}
            </Card>

            {recentCompletions.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3">Recent Completions</h3>
                <div className="space-y-2">
                  {recentCompletions.map((completion) => (
                    <Card key={completion.id} className="p-4" data-testid={`card-completion-${completion.id}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {new Date(completion.completedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {completion.completedItems.length} items completed
                          </p>
                        </div>
                        {completion.allItemsCompleted ? (
                          <Badge className="bg-lime-green/20 text-lime-green border-lime-green/30">
                            <CircleCheck className="w-3 h-3 mr-1" />
                            100%
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {Math.round((completion.completedItems.length / currentTemplate.items.length) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <Card className="p-5 bg-gradient-to-br from-taabi-blue/10 to-transparent">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-taabi-blue flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold mb-1">Pro Tip</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete all checklist items before every trip to ensure maximum safety and earn bonus points!
                  </p>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <Card className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Template Found</h3>
            <p className="text-muted-foreground">Unable to load checklist template</p>
          </Card>
        )}
      </div>
    </div>
  );
}
