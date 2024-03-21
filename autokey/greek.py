import time
#time.sleep(0.10)

def send_special_char(char):
    output = "<ctrl>+<shift>+u" + '%04x' % ord(char)
    keyboard.send_keys(output)
    keyboard.send_key('<enter>')
    

greek_map = {
    'a': 'α',
    'b': 'β',
    'g': 'γ',
    'd': 'δ',
    'e': 'ε',
    'z': 'ζ',
    'q': 'η',
    'h': 'θ',
    'i': 'ι',
    'k': 'ϰ',
    'l': 'λ',
    'm': 'μ',
    'n': 'ν',
    'x': 'ξ',
    'o': 'ο', # This one reeks of evil
    'p': 'π',
    'r': 'ρ',
    's': 'σ',
    't': 'τ',
    'u': 'υ',
    'f': 'φ',
    'c': 'χ',
    'j': 'ψ',
    'w': 'ω'}
    
greek_map_capital = {
    'A': 'Α',
    'B': 'Β',
    'G': 'Γ',
    'D': 'Δ',
    'E': 'Ε',
    'Z': 'Ζ',
    'Q': 'Η',
    'H': 'Θ',
    'I': 'Ι',
    'K': 'Κ',
    'L': 'Λ',
    'M': 'Μ',
    'N': 'Ν',
    'X': 'Ξ',
    'O': 'Ο', # This one reeks too
    'P': 'Π',
    'R': 'Ρ',
    'S': 'Σ',
    'T': 'Τ',
    'U': 'Υ',
    'F': 'Φ',
    'C': 'Χ',
    'J': 'Ψ',
    'W': 'Ω'}
    
def check_greek_input(waiter, rawKey, modifiers, key, *args):
    isCapital = len(modifiers) == 1 and modifiers[0] == '<shift>'
    isLowercase = len(modifiers) == 0
    if not isCapital and not isLowercase:
        waiter.result = ""
        store.set_value("greek-output", waiter.result)
        return True
    if isCapital:
        waiter.result = greek_map_capital[key] if key in greek_map_capital else ''
    else:
        waiter.result = greek_map[key] if key in greek_map else ''
    store.set_value("greek-output", waiter.result)
    return True
        
keyboard.wait_for_keyevent(check_greek_input, "greek-input")
to_print = store.get_value("greek-output")
store.remove_value("greek-output")
if to_print and len(to_print) == 1:
    keyboard.send_key('<backspace>')
    time.sleep(0.1)
    send_special_char(to_print)