import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Side - Contact Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-primary" />
                Get in Touch
              </CardTitle>
              <CardDescription>
                Have a question or feedback? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what's on your mind..."
                    className="min-h-32 resize-none"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Side - Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold gradient-text">
                We'd Love to Hear From You
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Whether you have a question about features, feedback about your
                experience, or just want to say hello, our team is ready to
                answer all your questions.
              </p>
            </div>

            <Card className="glass-effect">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-sm text-muted-foreground">
                      support@flick.com
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Quick Links</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → Frequently Asked Questions
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → Terms of Service
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → Privacy Policy
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    → Report a Bug
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
