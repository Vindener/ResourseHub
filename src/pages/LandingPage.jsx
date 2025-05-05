import React from "react";
import "./LandingPage.css"; // стилі як на скриншоті

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="welcome-sections">

      <section className="block violet">
        <div className="text">
          <h2>Планування, що працює для тебе, а не проти тебе</h2>
          <p>Структура без стресу.<br />Гнучкість без хаосу.<br />Ефективність без вигорання.</p>
        </div>
        <div className="image">
          <img src={"/images/landing/1.png"} alt="doctor" />
        </div>
      </section>

      <section className="block yellow reverse">
        <div className="text">
          <h3>Важко зосередитись? Забуваєш важливі справи?<br />Відчуваєш, що час вислизає з рук?</h3>
          <p>
            Традиційні планувальники не враховують особливості нейровідмінних людей.
            Жорсткі графіки, перевантажені списки справ і постійні нагадування можуть тільки посилювати стрес.
          </p>
          <p>
            Ми пропонуємо інше рішення — адаптивний планувальник, створений для людей з РДУГ!
          </p>
        </div>
        <div className="image">
          <img src={"/images/landing/2.png"} alt="confused person" />
        </div>
      </section>

      <section className="block blue">
        <div className="text">
          <h3>Як користуватись сервісом? Як це працює?</h3>
          <ul>
            <li><strong>Зареєструйся на сайті та налаштуй профіль</strong></li>
            <li><strong>Календарі та нотатники</strong> - твої найкращі друзі, можеш налаштувати їх як захочеться</li>
            <li><strong>Отримуй підтримку</strong> – наш алгоритм допоможе не перевантажувати себе справами завдяки системі ресурсу</li>
            <li><strong>Гейміфікація планування </strong>- заведи власного віртуального улюбленця, доглядай за ним та купуй йому аксесуари та іграшки за допомогою монеток, які даються за виконані заплановані справи</li>
            <li><strong>Дізнайся більше про РДУГ</strong>, його ознаки та як можна спробувати полегшити собі життя із цим діагнозом</li>
          </ul>
        </div>
        <div className="image">
          <img src={"/images/landing/3.png"} alt="person with lightbulb" />
        </div>
      </section>

      <section className="block ending">
        <p>
          І пам’ятай – РДУГ – це не вирок, а унікальна сила твого мислення, яка відкриває безмежні можливості.
          Просто потрібен правильний підхід до її використання!
        </p>
      </section>
    </div>
    </div>
  );
};

export default LandingPage;
