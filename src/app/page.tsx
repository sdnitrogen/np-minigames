import Description from "@/components/Description"
import GameNav from "@/components/Gamenav"
import Header from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mainDescription } from "@/constants"

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-8">
      <Header title="NoPixel Minigames Library" />
      <Description desc={mainDescription} />
      <section className="flex w-full h-auto flex-row items-center justify-center gap-8 p-4">
        <div className="w-min h-min p-1 rounded-lg bg-muted-foreground">
          <Card className="w-[22rem] h-[30rem] overflow-clip pb-4">
            <CardHeader>
              <CardTitle className="px-2 text-green-300">4.0</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full scroll-auto overflow-scroll">
              <GameNav navpath="/">Lockpick</GameNav>
              <GameNav navpath="/">Roof Running - Same Game</GameNav>
              <GameNav navpath="/">Smoke Crack - Typing</GameNav>
              <GameNav navpath="/">Repair Kit / HandCuff</GameNav>
              <GameNav navpath="/">BUTC Hack - Fallout</GameNav>
              <GameNav navpath="/">Vehicle Chop - Typing</GameNav>
              <GameNav navpath="/">Heist Pinger</GameNav>
              <GameNav navpath="/">Word memory</GameNav>
              <GameNav navpath="/">Maze Bank - Thermal Fuse</GameNav>
              <GameNav navpath="/">Maze Bank - Terminal</GameNav>
            </CardContent>
          </Card>
        </div>
        <div className="w-min h-min p-1 rounded-lg bg-muted-foreground">
          <Card className="w-[22rem] h-[30rem] overflow-clip pb-4">
            <CardHeader>
              <CardTitle className="px-2 text-yellow-300">3.0</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full scroll-auto overflow-scroll">
              <GameNav navpath="/">Lockpick</GameNav>
              <GameNav navpath="/">Laptop - Bank/Yacht/Vault</GameNav>
              <GameNav navpath="/">Thermite</GameNav>
              <GameNav navpath="/">VAR</GameNav>
              <GameNav navpath="/">Boosting - Hacking Device</GameNav>
              <GameNav navpath="/">Casino Code - Number Memory</GameNav>
              <GameNav navpath="/">USB</GameNav>
              <GameNav navpath="/">Untangle</GameNav>
              <GameNav navpath="/">DDR</GameNav>
              <GameNav navpath="/">Lights Out</GameNav>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

export default Home
