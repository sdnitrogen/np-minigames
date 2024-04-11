import Description from "@/components/Description"
import GameNav from "@/components/Gamenav"
import Header from "@/components/Header"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mainDescription } from "@/constants"

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-8">
      <Header title="NoPixel Minigames Library" />
      <Description desc={mainDescription} />
      <section className="flex w-full h-auto flex-row items-center justify-center gap-8 p-4">
        <div className="w-min h-min p-1 rounded-lg bg-muted-foreground">
          <Card className="w-[22rem] h-[36rem]">
            <CardHeader className="p-4">
              <CardTitle className="p-2 w-max rounded-sm bg-blue-600">
                4.0
              </CardTitle>
            </CardHeader>
            <ScrollArea className="w-full h-[32rem]">
              <div className="flex flex-col px-4 pb-4">
                <GameNav navpath="/">Lockpick</GameNav>
                <GameNav navpath="/same-game-4-0" done>
                  Same Game - Roof Running
                </GameNav>
                <GameNav navpath="/">Smoke Crack - Typing</GameNav>
                <GameNav navpath="/">Vehicle Chop - Typing</GameNav>
                <GameNav navpath="/">Repair Kit / HandCuff</GameNav>
                <GameNav navpath="/sniff-4-0" done>
                  Sniff - Crypto Hack
                </GameNav>
                <GameNav navpath="/noid-4-0" done>
                  Noid - Crypto Security
                </GameNav>
                <GameNav navpath="/">Heist Pinger</GameNav>
                <GameNav navpath="/word-memory-4-0" done>
                  Word Memory
                </GameNav>
                <GameNav navpath="/thermal-fuse-4-0" done>
                  Thermal Fuse - Maze Bank
                </GameNav>
                <GameNav navpath="/">Terminal - Maze Bank</GameNav>
              </div>
            </ScrollArea>
          </Card>
        </div>
        <div className="w-min h-min p-1 rounded-lg bg-muted-foreground">
          <Card className="w-[22rem] h-[36rem]">
            <CardHeader className="p-4">
              <CardTitle className="p-2 w-max rounded-sm bg-orange-600">
                3.0
              </CardTitle>
            </CardHeader>
            <ScrollArea className="w-full h-[32rem]">
              <div className="flex flex-col px-4 pb-4">
                <GameNav navpath="/">Lockpick</GameNav>
                <GameNav navpath="/">Laptop - Bank/Yacht/Vault</GameNav>
                <GameNav navpath="/">Thermite</GameNav>
                <GameNav navpath="/">VAR</GameNav>
                <GameNav navpath="/">Boosting - Hacking Device</GameNav>
                <GameNav navpath="/">Number Memory - Casino</GameNav>
                <GameNav navpath="/">USB</GameNav>
                <GameNav navpath="/">Untangle</GameNav>
                <GameNav navpath="/">DDR</GameNav>
                <GameNav navpath="/">Lights Out</GameNav>
              </div>
            </ScrollArea>
          </Card>
        </div>
      </section>
    </main>
  )
}

export default Home
