abstract class MyStreetFlight {
  flight() {
    console.log(`${this.name} attacks to ${this.getSpecialAttack()}`)
  }
  abstract getSpecialAttack(): string
  abstract get name(): string
}

class Ryu extends MyStreetFlight {
  getSpecialAttack(): string {
    return "Hadoop";
  }

  get name(): string {
    return "Ryu";
  }
}

class Chn extends MyStreetFlight {
  getSpecialAttack(): string {
    return "Spark";
  }

  get name(): string {
    return "Chn";
  }
}

const ryu = new Ryu()
ryu.flight()

const chn = new Chn()
chn.flight()