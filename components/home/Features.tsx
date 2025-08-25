import { Shield, Sparkles, Zap } from "lucide-react"
import { Card, CardContent } from "../ui/card"


const Features = () => {
  return (
    
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience shopping like never before with our cutting-edge artificial intelligence features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Smart Recommendations</h3>
                <p className="text-blue-100">
                  Get personalized product suggestions based on your preferences and behavior
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Natural Language Search</h3>
                <p className="text-blue-100">Search using everyday language like red sneakers under $100</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">AI Shopping Assistant</h3>
                <p className="text-blue-100">Get instant help and product advice from our intelligent chatbot</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}

export default Features
