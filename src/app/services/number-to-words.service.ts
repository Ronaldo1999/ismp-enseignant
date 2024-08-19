export class NumberToWordsService {
    private units: string[] = [
      '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    ];
    private teens: string[] = [
      'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
      'dix-sept', 'dix-huit', 'dix-neuf',
    ];
    private tens: string[] = [
      '', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante',
      'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix',
    ];
  
    public numberToWords(num: number): string {
      if (num === 0) return 'zéro';
      if (num < 0) return 'moins ' + this.numberToWords(-num);
  
      let words = '';
  
      if (Math.floor(num / 1000) > 0) {
        words += this.convertHundreds(Math.floor(num / 1000)) + ' mille ';
        num %= 1000;
      }
  
      if (num > 0) {
        words += this.convertHundreds(num);
      }
  
      return words.trim();
    }
  
    private convertHundreds(num: number): string {
      let words = '';
  
      if (Math.floor(num / 100) > 0) {
        words += this.units[Math.floor(num / 100)] + ' cent ';
        num %= 100;
      }
  
      if (num >= 20) {
        words += this.tens[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num >= 10) {
        words += this.teens[num - 10] + ' ';
        return words;
      }
  
      if (num > 0) {
        words += this.units[num] + ' ';
      }
  
      return words.trim();
    }
  }
  