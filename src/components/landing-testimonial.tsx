export default function Testimonial() {
  return (
    <section id="testimonial" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <img
            src="/placeholder.svg?height=100&width=100"
            alt="User Avatar"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <blockquote className="text-2xl italic mb-4">
            "VideoForge has completely transformed my workflow. I can now edit
            videos faster and with better results than ever before. It's a
            game-changer for content creators!"
          </blockquote>
          <p className="text-purple-400 font-semibold">Sarah Johnson</p>
          <p className="text-gray-400">Professional YouTuber</p>
        </div>
      </div>
    </section>
  );
}
