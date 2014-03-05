package main

import (
  "fmt"
  "math"
  "math/big"
  "flag"
)

// Thanks :)
// The Machin Pi Algorithm is from http://www.angio.net/pi/pi-programs.html

func arccot(x int64, unity *big.Int) *big.Int {
  bigx := big.NewInt(x)
  xsquared := big.NewInt(x*x)
  sum := big.NewInt(0)
  sum.Div(unity, bigx)
  xpower := big.NewInt(0)
  xpower.Set(sum)
  n := int64(3)
  zero := big.NewInt(0)
  sign := false
  term := big.NewInt(0)
  for {
    xpower.Div(xpower, xsquared)
    term.Div(xpower, big.NewInt(n))
    if term.Cmp(zero) == 0 {
      break
    }
    if sign {
      sum.Add(sum, term)
    } else {
      sum.Sub(sum, term)
    }
    sign = !sign
    n += 2
  }
  return sum
}

func machin(digits *big.Int) *big.Int {
  unity := big.NewInt(0)
  unity.Exp(big.NewInt(10), digits, nil)
  pi := big.NewInt(0)
  four := big.NewInt(4)
  pi.Mul(four, pi.Sub(pi.Mul(four, arccot(5, unity)), arccot(239, unity)))

  return pi
}

/* Does not work ... */

func archimedes(precision int) float64 {
  var polygonLength float64 = 2.0
  var polygonSides float64 = 4.0
  for i := 0; i < precision; i++ {
    fmt.Println(polygonLength, polygonSides)
    polygonLength = 2 - 2 * math.Sqrt(1 - polygonLength / 4)
    polygonSides *= 2
  }
  fmt.Println(polygonSides, polygonLength)
  return polygonSides * math.Sqrt(polygonLength) / 2
}

func main() {
  algorithm := flag.String("algorithm", "machin", "Algorithm")
  digitsFlag := flag.Int("d", 100, "Decimal Places")
  flag.Parse()

  digits := int64(*digitsFlag)

  if *algorithm == "machin" {
    fmt.Println(machin(big.NewInt(digits)).String())
  } else if *algorithm == "archimedes" {
    fmt.Println(archimedes(int(digits)))
  }

}
